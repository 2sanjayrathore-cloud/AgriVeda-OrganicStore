// =============================================================
// AgriVeda — Admin Login & Dashboard
// =============================================================

function AdminPortal(){
  const [t, lang] = useT();
  const toast = useToast();
  const [, navigate] = useRoute();
  const [logged, setLogged] = useState(window.AVStore.isAdmin());
  const [form, setForm] = useState({ id:"", pwd:"" });

  if (logged) return <AdminDashboard onLogout={() => { window.AVStore.adminLogout(); setLogged(false); }}/>;

  const submit = (e) => {
    e.preventDefault();
    if (window.AVStore.adminLogin(form.id.trim(), form.pwd)) {
      setLogged(true);
      toast(lang==="hi"?"स्वागत है, मालिक!":"Welcome, owner!", "success");
    } else {
      toast(t.admin.wrong, "error");
    }
  };

  return (
    <main className="portal-wrap">
      <form className="portal-card" onSubmit={submit}>
        <div className="brand-mark" style={{width:54, height:54, marginBottom:6}}><span style={{fontSize:24}}>🔒</span></div>
        <h2>{t.admin.portal}</h2>
        <p className="sub">{t.admin.sub}</p>
        <div className="field">
          <label>{t.admin.idOrEmail}</label>
          <input className="input" autoFocus value={form.id} onChange={e => setForm({...form, id:e.target.value})} placeholder="sanjayrathorevbyl@gmail.com / 7877612427"/>
        </div>
        <div className="field">
          <label>{t.admin.password}</label>
          <input className="input" type="password" value={form.pwd} onChange={e => setForm({...form, pwd:e.target.value})}/>
          <span className="field-hint">{lang==="hi"?"डिफ़ॉल्ट: आपका फोन (7877612427)":"Default: your phone (7877612427)"}</span>
        </div>
        <button className="btn btn-primary btn-block ripple mt-16" type="submit">{t.admin.login}</button>
        <div className="row" style={{marginTop:14, justifyContent:"center"}}>
          <button type="button" className="btn btn-ghost btn-sm ripple" onClick={() => navigate("/home")}>{t.common.back}</button>
        </div>
      </form>
    </main>
  );
}

function AdminDashboard({ onLogout }){
  const [t, lang] = useT();
  const store = useStore();
  const [tab, setTab] = useState("overview");
  const tabs = [
    { k:"overview", l:t.admin.tabs.overview, ic:"📊" },
    { k:"sales",    l:t.admin.tabs.sales,    ic:"🧾" },
    { k:"expenses", l:t.admin.tabs.expenses, ic:"💸" },
    { k:"students", l:t.admin.tabs.students, ic:"🎓" },
    { k:"products", l:t.admin.tabs.products, ic:"📦" },
    { k:"settings", l:t.admin.tabs.settings, ic:"⚙️" }
  ];
  return (
    <main className="section" style={{paddingTop:36}}>
      <div className="container">
        <div className="spread mb-16">
          <div>
            <span className="eyebrow">{t.nav.admin}</span>
            <h2 className="serif" style={{fontSize:36, margin:"6px 0 0"}}>{t.admin.welcome}</h2>
          </div>
          <div className="row">
            <button className="btn btn-soft ripple" onClick={() => {
              const csv = window.AVStore.exportFullWorkbookCSV();
              window.AVStore.downloadCSV(`agriveda_${new Date().toISOString().slice(0,10)}.csv`, csv);
            }}><Icon name="download" size={14}/> {t.admin.exportCSV}</button>
            <button className="btn btn-ghost ripple" onClick={onLogout}>{t.admin.logout}</button>
          </div>
        </div>

        <div className="tabs">
          {tabs.map(x => (
            <button key={x.k} className={"tab ripple " + (tab===x.k?"active":"")} onClick={() => setTab(x.k)}>{x.ic} {x.l}</button>
          ))}
        </div>

        {tab==="overview" && <OverviewTab/>}
        {tab==="sales" && <SalesTab/>}
        {tab==="expenses" && <ExpensesTab/>}
        {tab==="students" && <StudentsTab/>}
        {tab==="products" && <ProductsTab/>}
        {tab==="settings" && <SettingsTab/>}
      </div>
    </main>
  );
}

/* ============ Overview ============ */
function OverviewTab(){
  const [t, lang] = useT();
  const store = useStore();
  const k = window.AVStore.kpis();
  const sales = store.sales;
  const expenses = store.expenses;

  // Revenue over last 14 days
  const today = new Date(); today.setHours(0,0,0,0);
  const days = [];
  for (let i=13; i>=0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    days.push({ ts:d.getTime(), label:d.toLocaleDateString("en-IN",{day:"numeric",month:"short"}), revenue:0, expenses:0 });
  }
  sales.forEach(s => {
    const d = new Date(s.ts); d.setHours(0,0,0,0);
    const slot = days.find(x => x.ts === d.getTime());
    if (slot) slot.revenue += Number(s.total)||0;
  });
  expenses.forEach(e => {
    const dd = e.date ? new Date(e.date) : new Date(e.ts);
    dd.setHours(0,0,0,0);
    const slot = days.find(x => x.ts === dd.getTime());
    if (slot) slot.expenses += Number(e.amount)||0;
  });

  // Top products
  const prodMap = new Map();
  sales.forEach(s => (s.items||[]).forEach(i => {
    const cur = prodMap.get(i.id) || { id:i.id, name:i.name, qty:0, value:0 };
    cur.qty += Number(i.qty)||0;
    cur.value += (Number(i.qty)||0) * (Number(i.price)||0);
    prodMap.set(i.id, cur);
  }));
  const topProducts = Array.from(prodMap.values()).sort((a,b) => b.value - a.value).slice(0, 6);

  // Student leaderboard
  const stuMap = new Map();
  sales.forEach(s => {
    if (!s.studentId) return;
    const cur = stuMap.get(s.studentId) || { id:s.studentId, name:s.studentName, count:0, value:0 };
    cur.count += 1;
    cur.value += Number(s.total)||0;
    stuMap.set(s.studentId, cur);
  });
  const topStudents = Array.from(stuMap.values()).sort((a,b) => b.value - a.value).slice(0, 6);

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi kpi-leaf">
          <div className="lab">{t.admin.kpis.revenue}</div>
          <div className="val">{rupees(k.revenue)}</div>
          <div className="delta">📈 {k.orders} {t.admin.kpis.orders.toLowerCase()}</div>
        </div>
        <div className="kpi kpi-saffron">
          <div className="lab">{t.admin.kpis.expenses}</div>
          <div className="val">{rupees(k.expenses)}</div>
          <div className="delta">💸 {expenses.length} entries</div>
        </div>
        <div className="kpi kpi-earth">
          <div className="lab">{t.admin.kpis.balance}</div>
          <div className="val">{rupees(k.balance)}</div>
          <div className="delta">{k.balance >= 0 ? "✓ Profit" : "⚠ Loss"}</div>
        </div>
        <div className="kpi">
          <div className="lab">{t.admin.kpis.units}</div>
          <div className="val">{k.units}</div>
          <div className="delta muted">📦 sold across {k.orders} orders</div>
        </div>
        <div className="kpi">
          <div className="lab">{t.admin.kpis.students}</div>
          <div className="val">{k.students}</div>
          <div className="delta muted">🎓 approved sellers</div>
        </div>
        <div className="kpi">
          <div className="lab">{lang==="hi"?"लॉयल्टी पॉइंट्स":"Loyalty pts."}</div>
          <div className="val">{Object.values(store.loyalty||{}).reduce((a,b) => a+b, 0)}</div>
          <div className="delta muted">⭐ across {Object.keys(store.loyalty||{}).length} buyers</div>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:18, marginBottom:18}}>
        <div className="chart-card">
          <div className="spread mb-16">
            <h3 className="serif" style={{margin:0, fontSize:20}}>{t.admin.revOver}</h3>
            <div className="row">
              <span className="chip">{lang==="hi"?"पिछले 14 दिन":"Last 14 days"}</span>
            </div>
          </div>
          <Sparkline values={days.map(d => d.revenue)} h={160}/>
          <div className="row" style={{marginTop:14, gap:14, fontSize:12, color:"var(--slate)"}}>
            <span>● Revenue</span>
            <span style={{marginLeft:12}}>{lang==="hi"?"कुल इस अवधि":"Total this period"}: <strong style={{color:"var(--leaf-800)"}}>{rupees(days.reduce((a,d)=>a+d.revenue,0))}</strong></span>
          </div>
        </div>
        <div className="chart-card">
          <h3 className="serif" style={{margin:"0 0 14px", fontSize:20}}>{t.admin.topProd}</h3>
          <BarChart data={topProducts.map(p => ({ label:p.name, value:p.value, display: rupees(p.value) + ` (${p.qty})` }))} valueKey="value" labelKey="label"/>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="serif" style={{margin:"0 0 14px", fontSize:20}}>{t.admin.studentLB}</h3>
        {topStudents.length === 0 ? <div className="muted">{lang==="hi"?"कोई छात्र-बिक्री नहीं।":"No student sales yet."}</div> : (
          <div className="table-wrap" style={{minWidth:0}}>
            <table className="table">
              <thead><tr><th>#</th><th>{lang==="hi"?"छात्र":"Student"}</th><th>{lang==="hi"?"बिक्री":"Sales"}</th><th style={{textAlign:"right"}}>{lang==="hi"?"कुल मूल्य":"Total value"}</th></tr></thead>
              <tbody>
                {topStudents.map((s,i) => (
                  <tr key={s.id}>
                    <td><strong style={{color: i===0?"var(--saffron)":"var(--slate)"}}>{i===0?"🏆":i+1}</strong></td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.count}</td>
                    <td style={{textAlign:"right", fontFamily:"var(--serif)", fontSize:18, color:"var(--leaf-800)"}}>{rupees(s.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Sales tab ============ */
function SalesTab(){
  const [t, lang] = useT();
  const toast = useToast();
  const store = useStore();
  const settings = store.settings;
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [showInv, setShowInv] = useState(null);

  const list = store.sales.filter(s => {
    if (!q) return true;
    const t = q.toLowerCase();
    return [s.orderId, s.buyerName, s.buyerPhone, s.studentName, ...(s.items||[]).map(i=>i.name)].join(" ").toLowerCase().includes(t);
  });

  return (
    <div>
      <div className="row mb-16">
        <input className="input" placeholder={lang==="hi"?"ऑर्डर/नाम/फोन से खोजें…":"Search order, buyer or phone…"} value={q} onChange={e => setQ(e.target.value)} style={{maxWidth:380}}/>
        <div className="grow"></div>
        <button className="btn btn-soft ripple" onClick={() => window.AVStore.downloadCSV("agriveda_sales.csv", window.AVStore.exportSalesCSV())}>
          <Icon name="download" size={14}/> {lang==="hi"?"बिक्री CSV":"Sales CSV"}
        </button>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{t.checkout.orderId}</th>
              <th>{lang==="hi"?"दिनांक":"Date"}</th>
              <th>{lang==="hi"?"ख़रीदार":"Buyer"}</th>
              <th>{lang==="hi"?"उत्पाद":"Items"}</th>
              <th>{lang==="hi"?"कुल":"Total"}</th>
              <th>{lang==="hi"?"भुगतान":"Pay"}</th>
              <th>{lang==="hi"?"स्रोत":"By"}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.length===0 && <tr><td colSpan="8" className="muted center" style={{padding:30}}>{t.admin.noSales}</td></tr>}
            {list.map(s => (
              <tr key={s.id}>
                <td><strong>{s.orderId}</strong></td>
                <td className="muted">{formatDate(s.ts)}<br/><span style={{fontSize:11}}>{formatTime(s.ts)}</span></td>
                <td>
                  <div style={{fontWeight:600}}>{s.buyerName}</div>
                  <div className="muted" style={{fontSize:12}}>{s.buyerPhone}</div>
                </td>
                <td style={{maxWidth:240}}>
                  {(s.items||[]).map((i,idx) => <div key={idx} style={{fontSize:13}}>{i.name} × {i.qty}</div>)}
                </td>
                <td><strong style={{color:"var(--leaf-800)"}}>{rupees(s.total)}</strong></td>
                <td><span className="chip chip-line" style={{fontSize:11}}>{s.payment}</span></td>
                <td>{s.source==="student" ? <span className="chip chip-saffron" style={{fontSize:11}}>🎓 {s.studentName}</span> : <span className="chip" style={{fontSize:11}}>🛒 Online</span>}</td>
                <td>
                  <div className="row" style={{gap:4}}>
                    <button className="btn-icon ripple" onClick={() => setShowInv(s)} title="Invoice">🧾</button>
                    <button className="btn-icon ripple" onClick={() => setEditing(s)} title="Edit"><Icon name="edit" size={14}/></button>
                    <button className="btn-icon ripple" onClick={() => setConfirm(s)} title="Delete" style={{color:"var(--danger)"}}><Icon name="trash" size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={!!confirm}
        title={lang==="hi"?"बिक्री मिटाएँ?":"Delete sale?"}
        message={lang==="hi"?"यह क्रिया वापस नहीं होगी।":"This cannot be undone."}
        yesText={t.common.delete}
        danger
        onYes={() => { window.AVStore.deleteSale(confirm.id); setConfirm(null); toast(lang==="hi"?"मिटा दिया":"Deleted","info"); }}
        onNo={() => setConfirm(null)}
      />
      <Modal open={!!showInv} onClose={() => setShowInv(null)} size="lg" title={t.checkout.orderId + " " + (showInv?.orderId || "")} footer={
        <>
          <button className="btn btn-ghost ripple" onClick={() => setShowInv(null)}>{t.common.close}</button>
          {showInv && <a className="btn btn-primary ripple" target="_blank" rel="noreferrer" href={buildWhatsAppBuyerLink({ phone: showInv.buyerPhone, message: buildBillMessage(showInv, lang)})} style={{background:"#25D366"}}>
            <Icon name="whatsapp" size={14}/> WhatsApp
          </a>}
          <button className="btn btn-saffron ripple" onClick={() => window.print()}><Icon name="download" size={14}/> PDF</button>
        </>
      }>
        {showInv && <Invoice order={showInv} settings={settings}/>}
      </Modal>
      {editing && <EditSaleModal sale={editing} onClose={() => setEditing(null)}/>}
    </div>
  );
}

function EditSaleModal({ sale, onClose }){
  const [t, lang] = useT();
  const toast = useToast();
  const [form, setForm] = useState({
    buyerName: sale.buyerName||"",
    buyerPhone: sale.buyerPhone||"",
    buyerEmail: sale.buyerEmail||"",
    payment: sale.payment||"",
    total: sale.total||0,
    status: sale.status||"confirmed"
  });
  const save = () => {
    window.AVStore.updateSale(sale.id, form);
    toast(lang==="hi"?"बिक्री अपडेट हुई":"Sale updated","success");
    onClose();
  };
  return (
    <Modal open={true} onClose={onClose} title={`${t.common.edit} · ${sale.orderId}`} footer={<>
      <button className="btn btn-ghost ripple" onClick={onClose}>{t.common.cancel}</button>
      <button className="btn btn-primary ripple" onClick={save}>{t.common.save}</button>
    </>}>
      <div className="col">
        <div className="row">
          <div className="field grow"><label>Buyer name</label><input className="input" value={form.buyerName} onChange={e => setForm({...form, buyerName:e.target.value})}/></div>
          <div className="field grow"><label>Phone</label><input className="input" value={form.buyerPhone} onChange={e => setForm({...form, buyerPhone:e.target.value})}/></div>
        </div>
        <div className="row">
          <div className="field grow"><label>Email</label><input className="input" value={form.buyerEmail} onChange={e => setForm({...form, buyerEmail:e.target.value})}/></div>
          <div className="field grow"><label>Payment</label><input className="input" value={form.payment} onChange={e => setForm({...form, payment:e.target.value})}/></div>
        </div>
        <div className="row">
          <div className="field grow"><label>Total (₹)</label><input className="input" type="number" value={form.total} onChange={e => setForm({...form, total: Number(e.target.value)})}/></div>
          <div className="field grow"><label>Status</label>
            <select className="select" value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
              <option value="confirmed">confirmed</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ============ Expenses tab ============ */
function ExpensesTab(){
  const [t, lang] = useT();
  const toast = useToast();
  const store = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ title:"", amount:"", date: new Date().toISOString().slice(0,10), note:"" });

  const submit = () => {
    if (!form.title.trim() || !form.amount) {
      toast(lang==="hi"?"शीर्षक और राशि भरें":"Title and amount are required","error");
      return;
    }
    if (editing) {
      window.AVStore.updateExpense(editing.id, { ...form, amount: Number(form.amount) });
      toast(lang==="hi"?"खर्च अपडेट":"Expense updated","success");
    } else {
      window.AVStore.addExpense({ ...form, amount: Number(form.amount) });
      toast(lang==="hi"?"खर्च जोड़ा":"Expense added","success");
    }
    setShowAdd(false); setEditing(null);
    setForm({ title:"", amount:"", date: new Date().toISOString().slice(0,10), note:"" });
  };

  const startEdit = (e) => {
    setEditing(e);
    setForm({ title:e.title||"", amount: e.amount, date: e.date || new Date(e.ts).toISOString().slice(0,10), note: e.note||"" });
    setShowAdd(true);
  };

  return (
    <div>
      <div className="row mb-16">
        <button className="btn btn-primary ripple" onClick={() => { setEditing(null); setForm({ title:"", amount:"", date: new Date().toISOString().slice(0,10), note:"" }); setShowAdd(true); }}>
          <Icon name="plus" size={14}/> {t.admin.addExpense}
        </button>
        <div className="grow"></div>
        <button className="btn btn-soft ripple" onClick={() => window.AVStore.downloadCSV("agriveda_expenses.csv", window.AVStore.exportExpensesCSV())}>
          <Icon name="download" size={14}/> Expenses CSV
        </button>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>{lang==="hi"?"दिनांक":"Date"}</th><th>{t.admin.expenseTitle}</th><th>{t.admin.expenseAmt}</th><th>Note</th><th></th></tr></thead>
          <tbody>
            {store.expenses.length===0 && <tr><td colSpan="5" className="muted center" style={{padding:30}}>{t.admin.noExp}</td></tr>}
            {store.expenses.map(e => (
              <tr key={e.id}>
                <td className="muted">{e.date || formatDate(e.ts)}</td>
                <td><strong>{e.title}</strong></td>
                <td><strong style={{color:"var(--saffron-dark)"}}>{rupees(e.amount)}</strong></td>
                <td className="muted">{e.note}</td>
                <td>
                  <div className="row" style={{gap:4}}>
                    <button className="btn-icon ripple" onClick={() => startEdit(e)}><Icon name="edit" size={14}/></button>
                    <button className="btn-icon ripple" onClick={() => setConfirm(e)} style={{color:"var(--danger)"}}><Icon name="trash" size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditing(null); }} title={editing ? (lang==="hi"?"खर्च बदलें":"Edit expense") : t.admin.addExpense} footer={<>
        <button className="btn btn-ghost ripple" onClick={() => { setShowAdd(false); setEditing(null); }}>{t.common.cancel}</button>
        <button className="btn btn-primary ripple" onClick={submit}>{t.admin.saveExp}</button>
      </>}>
        <div className="col">
          <div className="field"><label>{t.admin.expenseTitle} *</label><input autoFocus className="input" value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder={lang==="hi"?"उदा. केंचुआ खरीद, बैग प्रिंटिंग":"e.g. Earthworm purchase, bag printing"}/></div>
          <div className="row">
            <div className="field grow"><label>{t.admin.expenseAmt} *</label><input className="input" type="number" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})}/></div>
            <div className="field grow"><label>{t.admin.expenseDate}</label><input className="input" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}/></div>
          </div>
          <div className="field"><label>{t.admin.expenseNote}</label><textarea className="textarea" rows={2} value={form.note} onChange={e => setForm({...form, note:e.target.value})}/></div>
        </div>
      </Modal>

      <ConfirmModal open={!!confirm} title={lang==="hi"?"खर्च मिटाएँ?":"Delete expense?"} message="" yesText={t.common.delete} danger
        onYes={() => { window.AVStore.deleteExpense(confirm.id); setConfirm(null); toast(lang==="hi"?"मिटा दिया":"Deleted","info"); }}
        onNo={() => setConfirm(null)}/>
    </div>
  );
}

/* ============ Students tab ============ */
function StudentsTab(){
  const [t, lang] = useT();
  const toast = useToast();
  const store = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ name:"", phone:"", code:"" });

  const genCode = () => "AV" + Math.random().toString(36).slice(2, 6).toUpperCase();

  const submit = () => {
    if (!form.name.trim() || !form.code.trim()) { toast("Name and code required","error"); return; }
    if (editing) {
      window.AVStore.updateStudent(editing.id, form);
      toast(lang==="hi"?"छात्र अपडेट":"Student updated","success");
    } else {
      window.AVStore.addStudent(form);
      toast(lang==="hi"?"छात्र स्वीकृत":"Student approved","success");
    }
    setShowAdd(false); setEditing(null);
    setForm({ name:"", phone:"", code:"" });
  };

  // Per-student sales count
  const counts = useMemo(() => {
    const m = new Map();
    store.sales.forEach(s => {
      if (!s.studentId) return;
      const c = m.get(s.studentId) || { count:0, value:0 };
      c.count += 1; c.value += Number(s.total)||0;
      m.set(s.studentId, c);
    });
    return m;
  }, [store.sales]);

  return (
    <div>
      <div className="row mb-16">
        <button className="btn btn-primary ripple" onClick={() => { setEditing(null); setForm({ name:"", phone:"", code: genCode() }); setShowAdd(true); }}>
          <Icon name="plus" size={14}/> {t.admin.addStudent}
        </button>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>{lang==="hi"?"नाम":"Name"}</th><th>Phone</th><th>{t.admin.stuCode}</th><th>{lang==="hi"?"बिक्री":"Sales"}</th><th></th></tr></thead>
          <tbody>
            {store.students.length===0 && <tr><td colSpan="5" className="muted center" style={{padding:30}}>{t.admin.noStu}</td></tr>}
            {store.students.map(s => {
              const c = counts.get(s.id) || { count:0, value:0 };
              return (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td className="muted">{s.phone}</td>
                  <td><code style={{background:"var(--cream-2)", padding:"3px 8px", borderRadius:6, fontWeight:700, color:"var(--leaf-800)"}}>{s.code}</code></td>
                  <td>{c.count} · <span className="muted">{rupees(c.value)}</span></td>
                  <td>
                    <div className="row" style={{gap:4}}>
                      <button className="btn-icon ripple" onClick={() => { setEditing(s); setForm({ name:s.name, phone:s.phone||"", code:s.code }); setShowAdd(true); }}><Icon name="edit" size={14}/></button>
                      <button className="btn-icon ripple" onClick={() => setConfirm(s)} style={{color:"var(--danger)"}}><Icon name="trash" size={14}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditing(null); }} title={editing ? "Edit student" : t.admin.addStudent} footer={<>
        <button className="btn btn-ghost ripple" onClick={() => { setShowAdd(false); setEditing(null); }}>{t.common.cancel}</button>
        <button className="btn btn-primary ripple" onClick={submit}>{t.admin.saveStu}</button>
      </>}>
        <div className="col">
          <div className="field"><label>{t.admin.stuName} *</label><input autoFocus className="input" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/></div>
          <div className="field"><label>{t.admin.stuPhone}</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/></div>
          <div className="field"><label>{t.admin.stuCode} *</label>
            <div className="row">
              <input className="input grow" value={form.code} onChange={e => setForm({...form, code:e.target.value.toUpperCase()})}/>
              <button className="btn btn-soft ripple" onClick={() => setForm({...form, code:genCode()})}>🎲 Generate</button>
            </div>
            <span className="field-hint">{lang==="hi"?"छात्र इस कोड से लॉगिन करेगा।":"Student will use this to log in."}</span>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!confirm} title={lang==="hi"?"छात्र हटाएँ?":"Remove student?"} message={lang==="hi"?"उनकी पिछली बिक्री सहेजी रहेगी।":"Their past sales remain saved."} yesText={t.common.delete} danger
        onYes={() => { window.AVStore.deleteStudent(confirm.id); setConfirm(null); toast(lang==="hi"?"हटा दिया":"Removed","info"); }}
        onNo={() => setConfirm(null)}/>
    </div>
  );
}

/* ============ Products tab ============ */
function ProductsTab(){
  const [t, lang] = useT();
  const toast = useToast();
  const store = useStore();
  const products = window.AVStore.products();
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(null);

  const startEdit = (p) => {
    setEditing(p || { id:"", nameEn:"", nameHi:"", cat:"", price:0, unit:"kg", stock:0, icon:"🌿", theme:"leaf", descEn:"", descHi:"", featured:false });
    setForm(p || { id:"", nameEn:"", nameHi:"", cat:"", price:0, unit:"kg", stock:0, icon:"🌿", theme:"leaf", descEn:"", descHi:"", featured:false });
  };
  const save = () => {
    if (!form.nameEn || !form.price || !form.unit) { toast("Name, price, unit required","error"); return; }
    if (!form.id) form.id = "p_" + Date.now();
    window.AVStore.upsertProduct(form);
    toast(lang==="hi"?"उत्पाद सहेजा गया":"Product saved","success");
    setEditing(null); setForm(null);
  };

  return (
    <div>
      <div className="row mb-16">
        <button className="btn btn-primary ripple" onClick={() => startEdit(null)}><Icon name="plus" size={14}/> {t.admin.addProduct}</button>
      </div>
      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <div className={"product-img t-" + (p.theme || "leaf")}>
              <span style={{fontSize:72}}>{p.icon}</span>
              <div style={{position:"absolute", top:8, right:8, display:"flex", gap:4}}>
                <button className="btn-icon ripple" style={{width:32, height:32, fontSize:13}} onClick={() => startEdit(p)}>✎</button>
                <button className="btn-icon ripple" style={{width:32, height:32, fontSize:13, color:"var(--danger)"}} onClick={() => setConfirm(p)}>🗑</button>
              </div>
            </div>
            <div className="product-info">
              <div className="product-cat">{p.cat}</div>
              <h3 className="product-name">{p.nameEn}</h3>
              <p className="product-desc">{p.descEn?.slice(0, 80)}…</p>
              <div className="product-foot">
                <div className="product-price">{rupees(p.price)}<small>/{p.unit}</small></div>
                <span className="chip">{p.stock} in stock</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => { setEditing(null); setForm(null); }} title={form?.id ? t.admin.editProduct : t.admin.addProduct} size="lg" footer={<>
        <button className="btn btn-ghost ripple" onClick={() => { setEditing(null); setForm(null); }}>{t.common.cancel}</button>
        <button className="btn btn-primary ripple" onClick={save}>{t.common.save}</button>
      </>}>
        {form && (
          <div className="col">
            <div className="row">
              <div className="field grow"><label>Name (English) *</label><input className="input" value={form.nameEn} onChange={e => setForm({...form, nameEn:e.target.value})}/></div>
              <div className="field grow"><label>Name (हिंदी)</label><input className="input" value={form.nameHi} onChange={e => setForm({...form, nameHi:e.target.value})}/></div>
            </div>
            <div className="row">
              <div className="field grow"><label>Category</label><input className="input" value={form.cat} onChange={e => setForm({...form, cat:e.target.value})}/></div>
              <div className="field" style={{minWidth:90}}><label>Icon (emoji)</label><input className="input" value={form.icon} onChange={e => setForm({...form, icon:e.target.value})}/></div>
              <div className="field" style={{minWidth:120}}><label>Theme</label>
                <select className="select" value={form.theme} onChange={e => setForm({...form, theme:e.target.value})}>
                  <option value="leaf">leaf</option>
                  <option value="saffron">saffron</option>
                  <option value="earth">earth</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="field grow"><label>Price (₹) *</label><input className="input" type="number" value={form.price} onChange={e => setForm({...form, price:Number(e.target.value)})}/></div>
              <div className="field" style={{minWidth:100}}><label>Unit *</label><input className="input" value={form.unit} onChange={e => setForm({...form, unit:e.target.value})} placeholder="kg / L"/></div>
              <div className="field grow"><label>Stock</label><input className="input" type="number" value={form.stock} onChange={e => setForm({...form, stock:Number(e.target.value)})}/></div>
              <div className="field"><label>Featured?</label>
                <label className="row" style={{height:46, paddingTop:10}}><input type="checkbox" checked={!!form.featured} onChange={e => setForm({...form, featured: e.target.checked})}/> Show on home</label>
              </div>
            </div>
            <div className="field"><label>Description (English)</label><textarea className="textarea" rows={2} value={form.descEn} onChange={e => setForm({...form, descEn:e.target.value})}/></div>
            <div className="field"><label>विवरण (हिंदी)</label><textarea className="textarea" rows={2} value={form.descHi} onChange={e => setForm({...form, descHi:e.target.value})}/></div>
          </div>
        )}
      </Modal>

      <ConfirmModal open={!!confirm} title={lang==="hi"?"उत्पाद हटाएँ?":"Remove product?"} message="" yesText={t.common.delete} danger
        onYes={() => { window.AVStore.deleteProduct(confirm.id); setConfirm(null); toast(lang==="hi"?"हटा दिया":"Removed","info"); }}
        onNo={() => setConfirm(null)}/>
    </div>
  );
}

/* ============ Settings tab ============ */
function SettingsTab(){
  const [t, lang] = useT();
  const toast = useToast();
  const store = useStore();
  const [s, setS] = useState(store.settings);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => setS(store.settings), [store.settings]);
  const save = () => { window.AVStore.updateSettings(s); toast(lang==="hi"?"सेटिंग्स सहेजी":"Settings saved","success"); };
  const shareUrl = location.origin + location.pathname;

  return (
    <div className="col">
      <div className="card" style={{padding:24}}>
        <h3 className="serif" style={{margin:"0 0 14px", fontSize:22}}>{lang==="hi"?"पहचान":"Identity"}</h3>
        <div className="row">
          <div className="field grow"><label>Admin email</label><input className="input" value={s.adminEmail} onChange={e => setS({...s, adminEmail:e.target.value})}/></div>
          <div className="field grow"><label>Admin phone</label><input className="input" value={s.adminPhone} onChange={e => setS({...s, adminPhone:e.target.value})}/></div>
        </div>
        <div className="row">
          <div className="field grow"><label>WhatsApp owner number</label><input className="input" value={s.whatsappAdmin} onChange={e => setS({...s, whatsappAdmin:e.target.value})}/></div>
          <div className="field grow"><label>Admin password</label><input className="input" type="password" value={s.adminPassword} onChange={e => setS({...s, adminPassword:e.target.value})}/></div>
        </div>
      </div>

      <div className="card" style={{padding:24}}>
        <h3 className="serif" style={{margin:"0 0 14px", fontSize:22}}>{lang==="hi"?"भुगतान (UPI)":"Payments (UPI)"}</h3>
        <div className="row">
          <div className="field grow"><label>UPI ID</label><input className="input" value={s.upiId} onChange={e => setS({...s, upiId:e.target.value})} placeholder="yourname@upi"/></div>
          <div className="field grow"><label>UPI display name</label><input className="input" value={s.upiName} onChange={e => setS({...s, upiName:e.target.value})}/></div>
          <div className="field" style={{minWidth:120}}><label>Loyalty %</label><input className="input" type="number" value={s.loyaltyPercent} onChange={e => setS({...s, loyaltyPercent: Number(e.target.value)})}/></div>
        </div>
      </div>

      <div className="row mt-8">
        <button className="btn btn-primary ripple" onClick={save}>{t.common.save}</button>
        <button className="btn btn-ghost ripple" onClick={() => setResetOpen(true)} style={{color:"var(--danger)", borderColor:"var(--danger)"}}><Icon name="trash" size={14}/> {t.admin.clearAll}</button>
      </div>

      <div className="card" style={{padding:24, background:"linear-gradient(135deg, var(--leaf-100), var(--saffron-soft))"}}>
        <h3 className="serif" style={{margin:"0 0 8px", fontSize:22}}>{lang==="hi"?"साझा करने योग्य लिंक":"Shareable link"}</h3>
        <p className="muted" style={{margin:"0 0 16px"}}>{lang==="hi"?"नीचे का QR स्कैन करें या लिंक कॉपी करें — कोई भी व्यक्ति आपकी दुकान खोल सकता है।":"Scan the QR or copy the link — anyone can open your store with it."}</p>
        <div className="row" style={{alignItems:"flex-start"}}>
          <div className="qr-frame"><QRCode data={shareUrl} size={180}/></div>
          <div className="grow col">
            <input className="input" readOnly value={shareUrl}/>
            <button className="btn btn-soft ripple" onClick={() => { navigator.clipboard?.writeText(shareUrl); toast(lang==="hi"?"लिंक कॉपी हुआ":"Link copied","success"); }}>📋 Copy link</button>
            <div style={{fontSize:12, color:"var(--slate)"}}>
              <div><strong>{lang==="hi"?"छात्र पोर्टल":"Student portal"}:</strong> {shareUrl}#/student</div>
              <div><strong>{lang==="hi"?"प्रबंधक":"Admin"}:</strong> {shareUrl}#/admin</div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal open={resetOpen} title="Reset all data?" message="All sales, expenses, students and overrides will be erased. Settings reset to defaults." yesText="Yes, reset" danger
        onYes={() => { window.AVStore.resetAll(); setResetOpen(false); toast("Reset complete","info"); }}
        onNo={() => setResetOpen(false)}/>
    </div>
  );
}

Object.assign(window, { AdminPortal, AdminDashboard, OverviewTab, SalesTab, ExpensesTab, StudentsTab, ProductsTab, SettingsTab });
