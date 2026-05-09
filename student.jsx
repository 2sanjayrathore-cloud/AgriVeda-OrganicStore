// =============================================================
// AgriVeda — Student portal & sales entry
// =============================================================

function StudentPortal(){
  const [t, lang] = useT();
  const toast = useToast();
  const [, navigate] = useRoute();
  const current = window.AVStore.currentStudent();
  const [code, setCode] = useState("");
  const [stage, setStage] = useState(current ? "entry" : "login");

  if (stage === "login") {
    const tryLogin = (e) => {
      e && e.preventDefault();
      const stu = window.AVStore.studentLogin(code);
      if (stu) {
        toast(lang==="hi"?`स्वागत है ${stu.name}!`:`Welcome ${stu.name}!`, "success");
        setStage("entry");
      } else {
        toast(lang==="hi"?"ग़लत एक्सेस कोड":"Invalid access code", "error");
      }
    };
    return (
      <main className="portal-wrap">
        <form className="portal-card" onSubmit={tryLogin}>
          <div className="brand-mark" style={{width:54, height:54, marginBottom:6}}><span style={{fontSize:24}}>🎓</span></div>
          <h2>{t.student.portal}</h2>
          <p className="sub">{t.student.sub}</p>
          <div className="field">
            <label>{t.student.code}</label>
            <input className="input" autoFocus value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="AGRI2026"/>
            <span className="field-hint">{t.student.forgot} · 7877612427</span>
          </div>
          <button className="btn btn-primary btn-block ripple mt-16" type="submit">{t.student.login} <Icon name="chevron" size={14}/></button>
          <div className="row" style={{marginTop:14, justifyContent:"center"}}>
            <button type="button" className="btn btn-ghost btn-sm ripple" onClick={() => navigate("/home")}>{t.common.back}</button>
          </div>
        </form>
      </main>
    );
  }

  return <StudentSalesEntry onLogout={() => { window.AVStore.studentLogout(); setStage("login"); }}/>;
}

function StudentSalesEntry({ onLogout }){
  const [t, lang] = useT();
  const toast = useToast();
  const [, navigate] = useRoute();
  const store = useStore();
  const stu = window.AVStore.currentStudent();
  const products = window.AVStore.products();

  const [form, setForm] = useState({
    productId: "",
    qty: 1,
    customPrice: "",
    buyerName:"", buyerPhone:"", buyerEmail:"", address:"",
    payment:"UPI"
  });
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const product = products.find(p => p.id === form.productId);
  const unitPrice = form.customPrice !== "" ? Number(form.customPrice) : (product?.price || 0);
  const total = unitPrice * Number(form.qty || 0);
  const valid = product && form.qty > 0 && form.buyerName.trim() && /^\d{10}$/.test(form.buyerPhone);

  const mySales = store.sales.filter(s => s.studentId === stu?.id).slice(0, 8);

  const submit = () => {
    if (!valid) {
      toast(lang==="hi"?"सभी ज़रूरी फ़ील्ड भरें (नाम, 10-अंक फ़ोन, उत्पाद)":"Fill all required fields (name, 10-digit phone, product)", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const sale = window.AVStore.addSale({
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        buyerEmail: form.buyerEmail,
        address: form.address,
        items: [{ id: product.id, name: lang==="hi"?product.nameHi:product.nameEn, qty: Number(form.qty), price: unitPrice }],
        total,
        payment: form.payment,
        source: "student",
        studentId: stu?.id,
        studentName: stu?.name,
        lang
      });
      setLastOrder(sale);
      setShowInvoice(true);
      setForm({ productId:"", qty:1, customPrice:"", buyerName:"", buyerPhone:"", buyerEmail:"", address:"", payment:"UPI" });
      setSubmitting(false);
      toast(t.student.successAlert, "success", 4500);
    }, 350);
  };

  const settings = store.settings;
  const billMsg = lastOrder ? buildBillMessage(lastOrder, lang) : "";
  const buyerWa = lastOrder ? buildWhatsAppBuyerLink({ phone: lastOrder.buyerPhone, message: billMsg }) : "";
  const adminWa = lastOrder ? buildWhatsAppAdminLink({ adminPhone: settings.whatsappAdmin, message: buildAdminAlert(lastOrder) }) : "";
  const adminMail = lastOrder ? buildMailtoLink({ to: settings.adminEmail, subject:`New AgriVeda Sale ${lastOrder.orderId} – ₹${lastOrder.total}`, body: buildAdminAlert(lastOrder) }) : "";

  return (
    <main className="section">
      <div className="container">
        <div className="spread mb-24">
          <div>
            <span className="eyebrow">{t.student.title}</span>
            <h2 className="serif" style={{fontSize:36, margin:"6px 0 0"}}>{lang==="hi"?`नमस्ते, ${stu?.name}`:`Hello, ${stu?.name}`}</h2>
            <p className="muted" style={{margin:"4px 0 0"}}>{t.student.subT}</p>
          </div>
          <button className="btn btn-ghost ripple" onClick={onLogout}>{t.student.logout}</button>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:24, alignItems:"flex-start"}}>
          <div className="card" style={{padding:28}}>
            <h3 className="serif" style={{fontSize:22, margin:"0 0 16px"}}>{t.student.productH}</h3>
            <div className="col">
              <div className="field">
                <label>{t.student.picked} *</label>
                <select className="select" value={form.productId} onChange={e => {
                  const p = products.find(x => x.id === e.target.value);
                  setForm({...form, productId: e.target.value, customPrice: p ? "" : form.customPrice});
                }}>
                  <option value="">— {t.student.picked} —</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {(lang==="hi"?p.nameHi:p.nameEn)} · ₹{p.price}/{p.unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row">
                <div className="field grow">
                  <label>{t.student.qty} *</label>
                  <input className="input" type="number" min="1" value={form.qty} onChange={e => setForm({...form, qty:e.target.value})}/>
                </div>
                <div className="field grow">
                  <label>{t.student.price}</label>
                  <input className="input" type="number" min="0" placeholder={product ? String(product.price) : "0"} value={form.customPrice} onChange={e => setForm({...form, customPrice:e.target.value})}/>
                </div>
                <div className="field" style={{minWidth:130}}>
                  <label>{t.student.total}</label>
                  <div className="input" style={{fontFamily:"var(--serif)", fontSize:22, color:"var(--leaf-800)", background:"var(--leaf-100)", border:"none"}}>{rupees(total)}</div>
                </div>
              </div>

              <div className="field">
                <label>{t.student.payment}</label>
                <div className="row">
                  {[
                    {v:"UPI · Paid", l:t.student.paymentUPI, ic:"💸"},
                    {v:"Cash", l:t.student.paymentCash, ic:"💵"}
                  ].map(o => (
                    <button key={o.v} type="button" className={"btn ripple " + (form.payment===o.v?"btn-primary":"btn-ghost")} onClick={() => setForm({...form, payment:o.v})}>
                      {o.ic} {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className="serif" style={{fontSize:22, margin:"16px 0 4px"}}>{t.student.buyerH}</h3>
              <div className="row">
                <div className="field grow">
                  <label>{t.student.buyerName} *</label>
                  <input className="input" value={form.buyerName} onChange={e => setForm({...form, buyerName:e.target.value})}/>
                </div>
                <div className="field grow">
                  <label>{t.student.buyerPhone} *</label>
                  <input className="input" value={form.buyerPhone} onChange={e => setForm({...form, buyerPhone:e.target.value.replace(/\D/g,"").slice(0,10)})} placeholder="9876543210"/>
                </div>
              </div>
              <div className="field">
                <label>{t.student.buyerEmail}</label>
                <input className="input" value={form.buyerEmail} onChange={e => setForm({...form, buyerEmail:e.target.value})}/>
              </div>
              <div className="field">
                <label>{lang==="hi"?"पता / नोट":"Address / note"}</label>
                <textarea className="textarea" rows={2} value={form.address} onChange={e => setForm({...form, address:e.target.value})}/>
              </div>

              <button className="btn btn-primary btn-lg ripple mt-16" disabled={!valid || submitting} onClick={submit}>
                {submitting ? <span><span className="typing-dots"><span></span><span></span><span></span></span> {t.student.submitting}</span> : <>✓ {t.student.submit}</>}
              </button>
            </div>
          </div>

          <div className="card" style={{padding:24}}>
            <h3 className="serif" style={{fontSize:22, margin:"0 0 14px"}}>{t.student.yourSales}</h3>
            {mySales.length === 0 ? (
              <p className="muted" style={{margin:0}}>{lang==="hi"?"अभी तक कोई बिक्री नहीं।":"No sales yet."}</p>
            ) : (
              <div className="col" style={{gap:8}}>
                {mySales.map(s => (
                  <div key={s.id} className="card" style={{padding:14, background:"var(--cream)", border:"1px solid var(--line-soft)"}}>
                    <div className="spread">
                      <strong style={{fontSize:13}}>{s.orderId}</strong>
                      <span className="chip chip-saffron">{rupees(s.total)}</span>
                    </div>
                    <div style={{fontSize:12, color:"var(--slate)", marginTop:4}}>
                      {s.buyerName} · {(s.items||[]).map(i=>`${i.name}×${i.qty}`).join(", ")}
                    </div>
                    <div style={{fontSize:11, color:"var(--slate-soft)", marginTop:2}}>
                      {formatDate(s.ts)} {formatTime(s.ts)} · {s.payment}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice modal after sale */}
      <Modal open={showInvoice} onClose={() => setShowInvoice(false)} size="lg" title={t.student.thanksH} footer={
        <>
          <button className="btn btn-ghost ripple" onClick={() => setShowInvoice(false)}>{t.common.close}</button>
          {lastOrder && <a className="btn btn-primary ripple" target="_blank" rel="noreferrer" href={buyerWa} style={{background:"#25D366"}}>
            <Icon name="whatsapp" size={14}/> {t.checkout.sendWA}
          </a>}
          {lastOrder && <a className="btn btn-saffron ripple" target="_blank" rel="noreferrer" href={adminWa}>📲 {lang==="hi"?"मालिक को सूचित":"Notify owner"}</a>}
          {lastOrder && <a className="btn btn-soft ripple" href={adminMail}>✉️</a>}
          <button className="btn btn-saffron ripple" onClick={() => window.print()}><Icon name="download" size={14}/> PDF</button>
        </>
      }>
        {lastOrder && <Invoice order={lastOrder} settings={settings}/>}
      </Modal>
    </main>
  );
}

Object.assign(window, { StudentPortal, StudentSalesEntry });
