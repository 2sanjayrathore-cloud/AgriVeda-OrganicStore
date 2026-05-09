// =============================================================
// AgriVeda — Data store (localStorage layer + helpers)
// =============================================================
// Single global store accessed by all React pages.
// Listeners notify subscribers on every mutation.

(function(){
  const KEY = "agriveda_store_v1";
  const ADMIN_KEY = "agriveda_admin_v1";
  const STUDENT_KEY = "agriveda_student_v1";
  const LANG_KEY = "agriveda_lang_v1";

  const DEFAULT = {
    sales: [],          // {id, orderId, ts, buyerName, buyerPhone, buyerEmail, items:[{id,name,qty,price}], total, payment, source:'shop'|'student', studentId, studentName, address, status}
    expenses: [],       // {id, ts, title, amount, date, note}
    students: [
      { id:"s_demo", name:"Demo Student", phone:"9999999999", code:"AGRI2026", createdAt: Date.now() }
    ],
    products: [],       // overrides — empty means use defaults from products.js
    settings: {
      adminEmail:"sanjayrathorevbyl@gmail.com",
      adminPhone:"7877612427",
      adminPassword:"7877612427",   // user can change in settings tab
      upiId:"7877612427@upi",        // user-editable
      upiName:"AgriVeda Organic",
      college:"",                    // empty per user request — no college name on site
      whatsappAdmin:"7877612427",
      loyaltyPercent: 2
    },
    counters: { order: 1001 },
    loyalty: {} // {phone: points}
  };

  function safeParse(s, fb){ try { return JSON.parse(s); } catch(e){ return fb; } }
  function load(){
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(DEFAULT)); return JSON.parse(JSON.stringify(DEFAULT)); }
    const parsed = safeParse(raw, DEFAULT);
    // Backfill new fields
    return Object.assign(JSON.parse(JSON.stringify(DEFAULT)), parsed, {
      settings: Object.assign({}, DEFAULT.settings, parsed.settings || {}),
      counters: Object.assign({}, DEFAULT.counters, parsed.counters || {}),
      loyalty: Object.assign({}, DEFAULT.loyalty, parsed.loyalty || {})
    });
  }
  function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); }

  let state = load();
  const subs = new Set();
  function notify(){ subs.forEach(fn => { try { fn(state); } catch(e){} }); }

  function set(updater){
    state = (typeof updater === "function") ? updater(state) : Object.assign({}, state, updater);
    save(state);
    notify();
  }

  // -------- Products --------
  function products(){
    const overrides = state.products || [];
    const base = (window.AGRIVEDA_PRODUCTS || []).map(p => Object.assign({}, p));
    // override merge by id
    const byId = new Map(base.map(p => [p.id, p]));
    overrides.forEach(o => {
      if (o.deleted) { byId.delete(o.id); return; }
      const existing = byId.get(o.id);
      byId.set(o.id, Object.assign({}, existing || {}, o));
    });
    return Array.from(byId.values());
  }
  function upsertProduct(p){
    set(s => {
      const arr = (s.products || []).filter(x => x.id !== p.id);
      arr.push(p);
      return Object.assign({}, s, { products: arr });
    });
  }
  function deleteProduct(id){
    set(s => {
      const arr = (s.products || []).filter(x => x.id !== id);
      arr.push({ id, deleted:true });
      return Object.assign({}, s, { products: arr });
    });
  }

  // -------- Orders / Sales --------
  function nextOrderId(){
    let n;
    set(s => { n = s.counters.order; return Object.assign({}, s, { counters: { order: n+1 } }); });
    return "AV-" + String(n);
  }
  function addSale(sale){
    const id = sale.id || ("S_"+Date.now()+"_"+Math.random().toString(36).slice(2,7));
    const orderId = sale.orderId || nextOrderId();
    const record = Object.assign({ id, orderId, ts: Date.now(), status:"confirmed" }, sale);
    set(s => Object.assign({}, s, { sales: [record, ...s.sales] }));
    // Loyalty
    if (record.buyerPhone) {
      const pts = Math.round((record.total||0) * ((state.settings.loyaltyPercent||0)/100));
      set(s => Object.assign({}, s, { loyalty: Object.assign({}, s.loyalty, { [record.buyerPhone]: (s.loyalty[record.buyerPhone]||0) + pts }) }));
    }
    return record;
  }
  function deleteSale(id){
    set(s => Object.assign({}, s, { sales: s.sales.filter(x => x.id !== id) }));
  }
  function updateSale(id, patch){
    set(s => Object.assign({}, s, { sales: s.sales.map(x => x.id === id ? Object.assign({}, x, patch) : x) }));
  }

  // -------- Expenses --------
  function addExpense(e){
    const id = e.id || ("E_"+Date.now()+"_"+Math.random().toString(36).slice(2,7));
    const record = Object.assign({ id, ts: Date.now() }, e);
    set(s => Object.assign({}, s, { expenses: [record, ...s.expenses] }));
    return record;
  }
  function deleteExpense(id){
    set(s => Object.assign({}, s, { expenses: s.expenses.filter(x => x.id !== id) }));
  }
  function updateExpense(id, patch){
    set(s => Object.assign({}, s, { expenses: s.expenses.map(x => x.id === id ? Object.assign({}, x, patch) : x) }));
  }

  // -------- Students --------
  function addStudent(stu){
    const id = stu.id || ("S_"+Date.now()+"_"+Math.random().toString(36).slice(2,7));
    const record = Object.assign({ id, createdAt: Date.now() }, stu);
    set(s => Object.assign({}, s, { students: [record, ...s.students] }));
    return record;
  }
  function deleteStudent(id){
    set(s => Object.assign({}, s, { students: s.students.filter(x => x.id !== id) }));
  }
  function updateStudent(id, patch){
    set(s => Object.assign({}, s, { students: s.students.map(x => x.id === id ? Object.assign({}, x, patch) : x) }));
  }
  function findStudentByCode(code){
    const c = (code||"").trim().toUpperCase();
    return state.students.find(s => (s.code||"").toUpperCase() === c);
  }

  // -------- Settings --------
  function updateSettings(patch){
    set(s => Object.assign({}, s, { settings: Object.assign({}, s.settings, patch) }));
  }

  // -------- Auth (admin/student session) --------
  function adminLogin(idOrEmail, pwd){
    const s = state.settings;
    const ok = ((idOrEmail === s.adminEmail) || (idOrEmail === s.adminPhone)) && pwd === s.adminPassword;
    if (ok) { sessionStorage.setItem(ADMIN_KEY, "1"); return true; }
    return false;
  }
  function adminLogout(){ sessionStorage.removeItem(ADMIN_KEY); }
  function isAdmin(){ return sessionStorage.getItem(ADMIN_KEY) === "1"; }

  function studentLogin(code){
    const s = findStudentByCode(code);
    if (s) { sessionStorage.setItem(STUDENT_KEY, JSON.stringify({id:s.id, name:s.name, code:s.code})); return s; }
    return null;
  }
  function studentLogout(){ sessionStorage.removeItem(STUDENT_KEY); }
  function currentStudent(){
    const raw = sessionStorage.getItem(STUDENT_KEY);
    return raw ? safeParse(raw, null) : null;
  }

  // -------- Lang --------
  function getLang(){ return localStorage.getItem(LANG_KEY) || "en"; }
  function setLang(l){ localStorage.setItem(LANG_KEY, l); window.dispatchEvent(new Event("agriveda-lang")); }

  // -------- Reset --------
  function resetAll(){
    localStorage.removeItem(KEY);
    state = load();
    notify();
  }

  // -------- CSV export --------
  function exportSalesCSV(){
    const rows = [["Order ID","Date","Time","Buyer Name","Buyer Phone","Buyer Email","Items","Total (₹)","Payment","Source","Recorded By","Status"]];
    state.sales.forEach(s => {
      const d = new Date(s.ts);
      const items = (s.items||[]).map(i => `${i.name} x${i.qty} @ ${i.price}`).join(" | ");
      rows.push([s.orderId, d.toLocaleDateString(), d.toLocaleTimeString(), s.buyerName||"", s.buyerPhone||"", s.buyerEmail||"", items, s.total, s.payment||"", s.source||"", s.studentName||"", s.status||""]);
    });
    return rowsToCSV(rows);
  }
  function exportExpensesCSV(){
    const rows = [["ID","Date","Title","Amount (₹)","Note"]];
    state.expenses.forEach(e => rows.push([e.id, e.date || new Date(e.ts).toLocaleDateString(), e.title, e.amount, e.note||""]));
    return rowsToCSV(rows);
  }
  function exportFullWorkbookCSV(){
    // Single CSV with sections
    const sales = exportSalesCSV();
    const expenses = exportExpensesCSV();
    const summary = `\n\n,Summary,,\n,Total Revenue (₹),${kpis().revenue}\n,Total Expenses (₹),${kpis().expenses}\n,Cash Balance (₹),${kpis().balance}\n,Orders,${kpis().orders}\n`;
    return "==SALES==\n" + sales + "\n\n==EXPENSES==\n" + expenses + summary;
  }
  function rowsToCSV(rows){
    return rows.map(r => r.map(c => {
      const v = (c==null) ? "" : String(c);
      if (v.includes(",") || v.includes("\"") || v.includes("\n")) return `"${v.replace(/"/g, '""')}"`;
      return v;
    }).join(",")).join("\n");
  }
  function downloadCSV(filename, csv){
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  // -------- KPIs --------
  function kpis(){
    const revenue = state.sales.reduce((a,s) => a + (Number(s.total)||0), 0);
    const expenses = state.expenses.reduce((a,e) => a + (Number(e.amount)||0), 0);
    return {
      revenue, expenses,
      balance: revenue - expenses,
      orders: state.sales.length,
      units: state.sales.reduce((a,s) => a + (s.items||[]).reduce((b,i) => b + (Number(i.qty)||0), 0), 0),
      students: state.students.length
    };
  }

  // Public API
  window.AVStore = {
    get state(){ return state; },
    subscribe: fn => { subs.add(fn); return () => subs.delete(fn); },
    set,
    products, upsertProduct, deleteProduct,
    addSale, deleteSale, updateSale, nextOrderId,
    addExpense, deleteExpense, updateExpense,
    addStudent, deleteStudent, updateStudent, findStudentByCode,
    updateSettings,
    adminLogin, adminLogout, isAdmin,
    studentLogin, studentLogout, currentStudent,
    getLang, setLang,
    resetAll,
    exportSalesCSV, exportExpensesCSV, exportFullWorkbookCSV, downloadCSV,
    kpis
  };
})();
