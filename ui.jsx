// =============================================================
// AgriVeda — Shared React UI components & hooks
// Provides: Toast, Modal, Icon, useStore, useLang, useT, etc.
// =============================================================
const { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } = React;

/* ================== Hooks ================== */
function useStore(){
  const [s, setS] = useState(window.AVStore.state);
  useEffect(() => window.AVStore.subscribe(setS), []);
  return s;
}
function useLang(){
  const [lang, setL] = useState(window.AVStore.getLang());
  useEffect(() => {
    const onChange = () => setL(window.AVStore.getLang());
    window.addEventListener("agriveda-lang", onChange);
    return () => window.removeEventListener("agriveda-lang", onChange);
  }, []);
  const set = (l) => window.AVStore.setLang(l);
  return [lang, set];
}
function useT(){
  const [lang] = useLang();
  return [window.AGRIVEDA_I18N[lang] || window.AGRIVEDA_I18N.en, lang];
}
function useRoute(){
  const get = () => (location.hash || "#/home").replace(/^#/, "") || "/home";
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const onHash = () => setRoute(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (to) => { location.hash = to.startsWith("/") ? to : "/" + to; window.scrollTo({top:0, behavior:"smooth"}); };
  return [route, navigate];
}

/* ================== Toast ================== */
const ToastCtx = createContext(null);
function ToastProvider({ children }){
  const [list, setList] = useState([]);
  const push = useCallback((msg, type="success", ms=2800) => {
    const id = Math.random().toString(36).slice(2);
    setList(l => [...l, { id, msg, type }]);
    setTimeout(() => setList(l => l.filter(t => t.id !== id)), ms);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-stack">
        {list.map(t => (
          <div key={t.id} className={"toast " + t.type}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "⚠" : "ℹ"}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast(){ return useContext(ToastCtx); }

/* ================== Modal ================== */
function Modal({ open, onClose, title, children, footer, size }){
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={"modal " + (size==="lg" ? "modal-lg" : size==="xl" ? "modal-xl" : "")} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="modal-head">
            <h3 className="serif" style={{fontSize:24, margin:0}}>{title}</h3>
            <button className="btn-icon ripple" onClick={onClose} aria-label="Close">✕</button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ================== Confirm helper ================== */
function ConfirmModal({ open, title, message, onYes, onNo, yesText="Confirm", danger=false }){
  return (
    <Modal open={open} onClose={onNo} title={title} footer={<>
      <button className="btn btn-ghost ripple" onClick={onNo}>Cancel</button>
      <button className={"btn ripple " + (danger ? "btn-danger" : "btn-primary")} onClick={onYes}>{yesText}</button>
    </>}>
      <p style={{margin:0, color:"var(--slate)"}}>{message}</p>
    </Modal>
  );
}

/* ================== Icon ================== */
const ICONS = {
  cart: "M3 4h2l2.4 11.5a2 2 0 0 0 2 1.5H18a2 2 0 0 0 2-1.5L22 8H6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z",
  search: "M11 19a8 8 0 1 1 5.3-2L21 21l-1.4 1.4-4.7-4.7A8 8 0 0 1 11 19Zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z",
  leaf: "M3 21c0-9 8-15 18-18-1 11-7 18-15 18-1 0-3 0-3 0z",
  bot: "M8 2h8v3H8V2Zm-2 4h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm3 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
  doctor: "M12 2C8 2 6 5 6 8v3a6 6 0 0 0 12 0V8c0-3-2-6-6-6Zm0 14c-3 0-7 1-7 4v2h14v-2c0-3-4-4-7-4Z",
  cog: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm9.4 4-2-.6.4-2-2-1-1.4 1.4-1.8-1L14 7l-2-1-1 1.6-1.8 1L7.4 7l-2 1 .4 2-2 .6L4 14l2 .6-.4 2 2 1L9 16.2l1.8 1L11 19l2 1 1-1.6 1.8-1 1.6 1.4 2-1-.4-2 2-.6L20 10Z",
  download: "M12 3v12m-5-5 5 5 5-5M4 21h16",
  send: "M3 11 22 2l-9 19-2-8-8-2Z",
  trash: "M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9Z",
  edit: "M14 3l7 7-12 12H2v-7L14 3Z",
  plus: "M12 4v16M4 12h16",
  close: "M6 6l12 12M18 6l-12 12",
  chevron: "M9 6l6 6-6 6",
  cam: "M4 7h4l2-3h4l2 3h4v12H4V7Zm8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  chart: "M3 21h18M5 17V9m4 8V5m4 12v-7m4 7V8",
  wallet: "M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V7Zm14 4h2v4h-2",
  package: "M12 2 2 7v10l10 5 10-5V7L12 2Zm0 2.4 7 3.5L12 11 5 7.9l7-3.5ZM4 9.6l7 3.5v7L4 16.6V9.6Zm16 0v7l-7 3.5v-7l7-3.5Z",
  rupee: "M6 4h12v2h-3.5a3 3 0 0 1 0 6H10l8 8h-3l-8-8h-1v-2h3a1 1 0 0 0 0-2H6V4Z",
  whatsapp: "M20 12a8 8 0 0 1-12 6.9L4 20l1.1-3.9A8 8 0 1 1 20 12Zm-8.4-3.5c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.4 0 2 1.4 4 1.6 4.3.2.3 2.8 4.3 6.9 5.9 3.4 1.3 4.1 1 4.9.9.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.2-.8-.4-.5-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.3-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.8-.7Z",
  globe: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2c-1.5 0-3 2.7-3.6 6h7.2C15 6.7 13.5 4 12 4Zm-5.6 6c-.3 1-.4 2-.4 2s.1 1 .4 2H4c-.5-1.2-.8-2.6-.8-2s.3-2.8.8-4h2.4Zm.7 6h2.5c-.4-1.3-.6-2.6-.6-4 0 0 .2-2.7.6-4h-2.5c-.4 1.2-.6 2.6-.6 4 0 1.4.2 2.8.6 4Z",
  qr: "M3 3h7v7H3V3Zm2 2v3h3V5H5Zm9-2h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Zm9 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2h-2v-2Zm4 0h2v2h-2v-2Z",
  mic: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3"
};
function Icon({ name, size=18, stroke="currentColor", fill="none" }){
  const d = ICONS[name] || "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ================== Brand ================== */
function BrandLogo({ size=38 }){
  return (
    <div className="brand-mark" style={{width:size, height:size}}>
      <svg viewBox="0 0 32 32" width={size*0.65} height={size*0.65} fill="none">
        <path d="M16 4c-7 4-9 11-7 17 4-1 9-3 12-9 2-4 1-6-5-8Z" fill="white" opacity=".95"/>
        <path d="M9 21c4-2 8-7 9-13" stroke="#1B5235" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ================== Format helpers ================== */
function rupees(n){
  const v = Math.round(Number(n)||0);
  return "₹" + v.toLocaleString("en-IN");
}
function formatDate(ts){
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}
function formatTime(ts){
  return new Date(ts).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
}

/* ================== Cart hook ================== */
const CART_KEY = "agriveda_cart_v1";
function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); window.dispatchEvent(new Event("agriveda-cart")); }
function useCart(){
  const [items, setItems] = useState(loadCart());
  useEffect(() => {
    const onChange = () => setItems(loadCart());
    window.addEventListener("agriveda-cart", onChange);
    window.addEventListener("storage", onChange);
    return () => { window.removeEventListener("agriveda-cart", onChange); window.removeEventListener("storage", onChange); };
  }, []);
  const add = (product, qty=1) => {
    const cur = loadCart();
    const found = cur.find(c => c.id === product.id);
    if (found) found.qty += qty; else cur.push({ id: product.id, qty });
    saveCart(cur);
  };
  const remove = (id) => saveCart(loadCart().filter(c => c.id !== id));
  const update = (id, qty) => {
    const cur = loadCart().map(c => c.id === id ? { ...c, qty: Math.max(1, qty) } : c);
    saveCart(cur);
  };
  const clear = () => saveCart([]);
  const count = items.reduce((a,b) => a + b.qty, 0);
  return { items, add, remove, update, clear, count };
}

/* ================== UPI / WhatsApp / Email helpers ================== */
function buildUpiLink({ upiId, name, amount, note }){
  const params = new URLSearchParams({
    pa: upiId, pn: name, am: String(amount), cu: "INR", tn: note || "AgriVeda Order"
  });
  return "upi://pay?" + params.toString();
}
function buildWhatsAppBuyerLink({ phone, message }){
  const p = String(phone||"").replace(/\D/g, "");
  if (!p) return "";
  const num = p.length === 10 ? "91" + p : p;
  return "https://wa.me/" + num + "?text=" + encodeURIComponent(message || "");
}
function buildWhatsAppAdminLink({ adminPhone, message }){
  const p = String(adminPhone||"").replace(/\D/g, "");
  if (!p) return "";
  const num = p.length === 10 ? "91" + p : p;
  return "https://wa.me/" + num + "?text=" + encodeURIComponent(message || "");
}
function buildMailtoLink({ to, subject, body }){
  return "mailto:" + (to||"") + "?subject=" + encodeURIComponent(subject||"") + "&body=" + encodeURIComponent(body||"");
}
function buildBillMessage(order, lang="en"){
  const t = (window.AGRIVEDA_I18N[lang] || window.AGRIVEDA_I18N.en);
  const lines = [];
  lines.push(`🌿 *AgriVeda Organic Store*`);
  lines.push(``);
  lines.push(lang === "hi" ? `नमस्ते ${order.buyerName || ""} 🙏` : `Hi ${order.buyerName || ""} 🙏`);
  lines.push(lang === "hi" ? `आपके ऑर्डर के लिए धन्यवाद!` : `Thanks for your order!`);
  lines.push(``);
  lines.push(`*${t.checkout.orderId}:* ${order.orderId}`);
  lines.push(`*Date:* ${new Date(order.ts).toLocaleString("en-IN")}`);
  lines.push(``);
  lines.push(`*Items:*`);
  (order.items || []).forEach(i => {
    lines.push(`• ${i.name} × ${i.qty} = ₹${i.price * i.qty}`);
  });
  lines.push(``);
  lines.push(`*${t.cart.total}: ₹${order.total}*`);
  lines.push(`Payment: ${order.payment || "—"}`);
  lines.push(``);
  lines.push(lang === "hi" ? `🌱 जैविक रहें, स्वस्थ रहें।` : `🌱 Stay organic, stay healthy.`);
  lines.push(`AgriVeda · 7877612427`);
  return lines.join("\n");
}
function buildAdminAlert(order){
  return [
    "🔔 NEW SALE @ AgriVeda",
    `Order ${order.orderId}`,
    `Buyer: ${order.buyerName} (${order.buyerPhone})`,
    `Items: ${(order.items||[]).map(i=>`${i.name} x${i.qty}`).join(", ")}`,
    `Total: ₹${order.total}`,
    `Payment: ${order.payment}`,
    `By: ${order.studentName || "Online buyer"}`,
    `Time: ${new Date(order.ts).toLocaleString("en-IN")}`
  ].join("\n");
}

/* ================== QR (canvas-based, simple) ================== */
// Lightweight QR rendering using QR Server API endpoint as image fallback
function QRCode({ data, size=200 }){
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(data)}`;
  return <img src={url} width={size} height={size} alt="QR" style={{borderRadius:8, background:"white"}} />;
}

/* ================== Sparkline / Chart ================== */
function Sparkline({ values, w=600, h=140, color="#1B5235", fill="rgba(27,82,53,.12)" }){
  if (!values || values.length === 0) values = [0,0];
  if (values.length === 1) values = [values[0], values[0]];
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = (max - min) || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v,i) => [i*step, h - ((v - min)/range) * (h - 16) - 8]);
  const linePath = pts.map((p,i) => (i===0?`M ${p[0]} ${p[1]}`:`L ${p[0]} ${p[1]}`)).join(" ");
  const fillPath = linePath + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <path d={fillPath} fill={fill} />
      <path d={linePath} stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />)}
    </svg>
  );
}

function BarChart({ data, valueKey="value", labelKey="label", color="#1B5235" }){
  if (!data || !data.length) return <div className="muted center" style={{padding:20}}>No data yet</div>;
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div style={{display:"flex", flexDirection:"column", gap:10}}>
      {data.map((d,i) => (
        <div key={i}>
          <div style={{display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4}}>
            <span style={{fontWeight:600}}>{d[labelKey]}</span>
            <span className="muted">{d.display || rupees(d[valueKey])}</span>
          </div>
          <div style={{height:10, background:"var(--cream-2)", borderRadius:999, overflow:"hidden"}}>
            <div style={{
              width: ((d[valueKey]/max)*100)+"%",
              height:"100%",
              background: `linear-gradient(90deg, ${color}, ${color})`,
              borderRadius:999,
              transition:"width .6s ease"
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================== Lang switch component ================== */
function LangSwitch(){
  const [lang, setLang] = useLang();
  const next = lang === "en" ? "hi" : "en";
  return (
    <button className="btn btn-ghost btn-sm ripple" onClick={() => setLang(next)} title="Switch language">
      <Icon name="globe" size={14} /> {lang === "en" ? "हिंदी" : "EN"}
    </button>
  );
}

/* ================== Export to global scope ================== */
Object.assign(window, {
  useStore, useLang, useT, useRoute,
  ToastProvider, useToast,
  Modal, ConfirmModal,
  Icon, BrandLogo,
  rupees, formatDate, formatTime,
  useCart,
  buildUpiLink, buildWhatsAppBuyerLink, buildWhatsAppAdminLink, buildMailtoLink,
  buildBillMessage, buildAdminAlert,
  QRCode, Sparkline, BarChart, LangSwitch
});
