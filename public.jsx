// =============================================================
// AgriVeda — Public pages: Home, Shop, Cart drawer, Checkout
// =============================================================

/* ============== Home ============== */
function HomePage(){
  const [t, lang] = useT();
  const [, navigate] = useRoute();
  const products = window.AVStore.products();
  const featured = products.filter(p => p.featured).slice(0,3);

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1 className="display">
              {t.hero.h1Lead}<br/>
              {t.hero.h1EmStart}<em>{t.hero.h1Em}</em>{t.hero.h1End}
            </h1>
            <p className="lede">{t.hero.lede}</p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg ripple" onClick={() => navigate("/shop")}>
                <Icon name="cart" size={16} /> {t.hero.ctaShop}
              </button>
              <button className="btn btn-ghost btn-lg ripple" onClick={() => navigate("/doctor")}>
                <Icon name="doctor" size={16} /> {t.hero.ctaDoctor}
              </button>
            </div>
            <div className="hero-stats">
              {t.hero.stats.map((s,i) => (
                <div key={i} className="hero-stat">
                  <div className="num serif">{s.n}</div>
                  <div className="lab">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-art">
            <div className="bgleaf"></div>
            <svg viewBox="0 0 400 500" style={{position:"absolute", inset:0, width:"100%", height:"100%"}}>
              {/* Big leaf */}
              <path d="M200 80 C 110 110 70 200 90 320 C 180 320 270 250 290 160 C 280 110 250 90 200 80 Z" fill="#3F8B5B" opacity=".55"/>
              <path d="M200 80 C 200 120 180 200 130 290" stroke="#143F29" strokeWidth="2" fill="none" opacity=".7"/>
              <path d="M180 160 C 150 170 130 200 130 230" stroke="#143F29" strokeWidth="1.6" fill="none" opacity=".5"/>
              <path d="M200 200 C 220 210 240 220 260 220" stroke="#143F29" strokeWidth="1.6" fill="none" opacity=".5"/>
              {/* Worm illustration */}
              <path d="M70 400 Q 110 380 150 400 T 230 400 T 310 400" stroke="#8B5E3C" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".7"/>
              <circle cx="305" cy="397" r="3" fill="#143F29" opacity=".7"/>
              {/* Sun rays */}
              <circle cx="340" cy="90" r="36" fill="#E08A2B" opacity=".7"/>
              <circle cx="340" cy="90" r="22" fill="#FBE5C5"/>
            </svg>

            <div className="hero-art-card c1">
              <div className="hero-art-icon">🌱</div>
              <div>
                <div className="lbl-1">Vermicompost</div>
                <div className="lbl-2">{lang==="hi"?"₹10/किग्रा से":"From ₹10/kg"}</div>
              </div>
            </div>
            <div className="hero-art-card c2">
              <div className="hero-art-icon">💧</div>
              <div>
                <div className="lbl-1">Jeevamrit</div>
                <div className="lbl-2">{lang==="hi"?"ZBNF का दिल":"Heart of ZBNF"}</div>
              </div>
            </div>
            <div className="hero-art-card c3">
              <div className="hero-art-icon">🤖</div>
              <div>
                <div className="lbl-1">{lang==="hi"?"AI डॉक्टर":"AI Doctor"}</div>
                <div className="lbl-2">{lang==="hi"?"24×7 निःशुल्क":"24×7 free"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t.home.featuredEy}</span>
              <h2 className="display">{t.home.featuredH}</h2>
            </div>
            <p>{t.home.featuredP}</p>
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} p={p} t={t} lang={lang}/>)}
          </div>
          <div className="row" style={{justifyContent:"center", marginTop:32}}>
            <button className="btn btn-soft ripple" onClick={() => navigate("/shop")}>
              {lang==="hi"?"पूरा कैटलॉग देखें":"See full catalog"} <Icon name="chevron" size={14}/>
            </button>
          </div>
        </div>
      </section>

      {/* Why three pillars */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t.home.whyEy}</span>
              <h2 className="display">{t.home.whyH}</h2>
            </div>
            <p>{t.home.whyP}</p>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18}}>
            {t.home.pillars.map((p,i) => (
              <div key={i} className="card card-elev" style={{padding:28}}>
                <div style={{fontSize:42, marginBottom:14}}>{p.i}</div>
                <h3 className="serif" style={{fontSize:24, margin:"0 0 8px"}}>{p.t}</h3>
                <p className="muted" style={{margin:0, lineHeight:1.55}}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Doctor */}
      <section className="section section-leaf">
        <div className="container" style={{display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:48, alignItems:"center"}}>
          <div>
            <span className="eyebrow">{lang==="hi"?"AI सहायक":"AI Helper"}</span>
            <h2 className="display" style={{color:"var(--paper)", marginTop:8}}>{t.home.ctaH}</h2>
            <p style={{color:"var(--leaf-300)", maxWidth:560, fontSize:17, lineHeight:1.6, marginTop:14}}>{t.home.ctaP}</p>
            <div className="row" style={{marginTop:24}}>
              <button className="btn btn-saffron ripple" onClick={() => navigate("/doctor")}>
                <Icon name="doctor" size={16}/> {t.hero.ctaDoctor}
              </button>
              <button className="btn btn-ghost ripple" onClick={() => navigate("/chat")} style={{borderColor:"rgba(255,255,255,.2)", color:"var(--paper)"}}>
                <Icon name="bot" size={16}/> {t.nav.chat}
              </button>
            </div>
          </div>
          <DoctorPreview lang={lang}/>
        </div>
      </section>

      <Footer t={t}/>
    </main>
  );
}

function DoctorPreview({ lang }){
  return (
    <div className="card" style={{background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", padding:0, overflow:"hidden"}}>
      <div style={{padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,.1)", display:"flex", alignItems:"center", gap:10}}>
        <div style={{width:32, height:32, borderRadius:10, background:"var(--saffron)", display:"grid", placeItems:"center"}}>🩺</div>
        <div>
          <div style={{fontWeight:700, color:"var(--paper)", fontSize:14}}>{lang==="hi"?"AI पादप डॉक्टर":"AI Plant Doctor"}</div>
          <div style={{fontSize:11, color:"var(--leaf-300)"}}>{lang==="hi"?"ऑनलाइन":"Online"}</div>
        </div>
      </div>
      <div style={{padding:18, display:"flex", flexDirection:"column", gap:10}}>
        <div className="chat-msg user" style={{background:"var(--paper)", color:"var(--ink)"}}>
          {lang==="hi"?"मेरे टमाटर के पत्ते मुड़ रहे हैं और पीले हो रहे हैं":"My tomato leaves are curling and turning yellow"}
        </div>
        <div className="chat-msg ai" style={{background:"rgba(255,255,255,.96)"}}>
          <strong>{lang==="hi"?"रसचूसक कीट का प्रकोप।":"Sucking pest infestation."}</strong> {lang==="hi"?"हर 7 दिन में":"Every 7 days, spray"} <strong>Neemastra</strong> {lang==="hi"?"का छिड़काव करें (बिना पतला किए)। यदि अधिक हो तो 3% Brahmastra मिलाएँ।":"undiluted. If heavy, add 3% Brahmastra."}
        </div>
      </div>
    </div>
  );
}

/* ============== Product Card ============== */
function ProductCard({ p, t, lang }){
  const cart = useCart();
  const inCart = cart.items.find(c => c.id === p.id);
  const oos = (p.stock || 0) <= 0;
  return (
    <div className="product-card">
      <div className={"product-img t-" + (p.theme || "leaf")}>
        {p.featured && <div className="product-tag featured">★ Best</div>}
        {!p.featured && <div className="product-tag">{p.cat}</div>}
        <span style={{fontSize:96, position:"relative", zIndex:1}}>{p.icon}</span>
      </div>
      <div className="product-info">
        <div className="product-cat">{p.cat}</div>
        <h3 className="product-name">{lang==="hi" ? p.nameHi : p.nameEn}</h3>
        <p className="product-desc">{lang==="hi" ? p.descHi : p.descEn}</p>
        <div className="product-foot">
          <div className="product-price">{rupees(p.price)}<small>/{p.unit}</small></div>
          {oos
            ? <span className="chip">{t.shop.outOfStock}</span>
            : (
              <button className={"btn ripple " + (inCart ? "btn-soft" : "btn-primary") + " btn-sm"} onClick={() => cart.add(p, 1)}>
                <Icon name={inCart?"plus":"cart"} size={14}/> {inCart ? `${inCart.qty} ${t.shop.inCart}` : t.shop.addCart}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

/* ============== Shop Page ============== */
function ShopPage(){
  const [t, lang] = useT();
  const products = window.AVStore.products();
  const cats = useMemo(() => Array.from(new Set(products.map(p => p.cat))), [products]);
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const list = products.filter(p => {
    if (filter !== "ALL" && p.cat !== filter) return false;
    if (q) {
      const s = q.toLowerCase();
      return (p.nameEn||"").toLowerCase().includes(s) || (p.nameHi||"").includes(q) || (p.cat||"").toLowerCase().includes(s);
    }
    return true;
  });
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head" style={{marginBottom:24}}>
            <div>
              <span className="eyebrow">{t.nav.shop}</span>
              <h2 className="display">{t.shop.h}</h2>
            </div>
            <p>{t.shop.p}</p>
          </div>

          <div style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"center", marginBottom:24}}>
            <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
              <button className={"chip " + (filter==="ALL"?"":"chip-line")} onClick={() => setFilter("ALL")} style={{cursor:"pointer", border:"none"}}>{t.shop.filterAll}</button>
              {cats.map(c => (
                <button key={c} className={"chip " + (filter===c?"":"chip-line")} onClick={() => setFilter(c)} style={{cursor:"pointer", border:filter===c?"none":""}}>{c}</button>
              ))}
            </div>
            <div className="grow"></div>
            <div style={{position:"relative", minWidth:240}}>
              <Icon name="search" size={16} stroke="var(--slate)"/>
              <input
                className="input"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={t.shop.search}
                style={{paddingLeft:36}}
              />
              <span style={{position:"absolute", left:12, top:14}}><Icon name="search" size={16} stroke="var(--slate)"/></span>
            </div>
          </div>

          <div className="products-grid">
            {list.map(p => <ProductCard key={p.id} p={p} t={t} lang={lang}/>)}
          </div>
          {list.length === 0 && <div className="card center muted" style={{padding:48}}>No products match your filter.</div>}
        </div>
      </section>
      <Footer t={t}/>
    </main>
  );
}

/* ============== Cart Drawer ============== */
function CartDrawer({ open, onClose, onCheckout }){
  const [t, lang] = useT();
  const cart = useCart();
  const products = window.AVStore.products();
  const items = cart.items.map(c => {
    const p = products.find(p => p.id === c.id);
    return p ? { ...p, qty: c.qty } : null;
  }).filter(Boolean);
  const subtotal = items.reduce((a,i) => a + i.price * i.qty, 0);

  if (!open) return null;
  return (
    <>
      <div className="drawer-back" onClick={onClose}/>
      <aside className="drawer">
        <div className="drawer-head">
          <h3 className="serif" style={{margin:0, fontSize:24}}>{t.cart.title}</h3>
          <button className="btn-icon ripple" onClick={onClose}><Icon name="close" size={16}/></button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="center" style={{padding:"40px 0"}}>
              <div style={{fontSize:48, marginBottom:8}}>🛒</div>
              <h4 className="serif" style={{fontSize:22, margin:"6px 0"}}>{t.cart.empty}</h4>
              <p className="muted">{t.cart.emptyP}</p>
            </div>
          ) : items.map(i => (
            <div key={i.id} className="cart-item">
              <div className="cart-item-thumb">{i.icon}</div>
              <div>
                <div style={{fontWeight:600, fontSize:14}}>{lang==="hi"?i.nameHi:i.nameEn}</div>
                <div className="muted" style={{fontSize:12}}>{rupees(i.price)} / {i.unit}</div>
                <div className="qty-stepper" style={{marginTop:6}}>
                  <button onClick={() => cart.update(i.id, i.qty-1)}>−</button>
                  <span className="v">{i.qty}</span>
                  <button onClick={() => cart.update(i.id, i.qty+1)}>+</button>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--serif)", fontSize:18}}>{rupees(i.price * i.qty)}</div>
                <button className="btn btn-ghost btn-sm ripple" style={{padding:"4px 8px", marginTop:4}} onClick={() => cart.remove(i.id)}>
                  <Icon name="trash" size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="spread" style={{marginBottom:14}}>
              <span className="muted">{t.cart.subtotal}</span>
              <strong style={{fontFamily:"var(--serif)", fontSize:22}}>{rupees(subtotal)}</strong>
            </div>
            <div className="row">
              <button className="btn btn-ghost ripple" onClick={cart.clear}>{t.cart.clear}</button>
              <button className="btn btn-primary btn-block ripple" style={{flex:1}} onClick={() => { onClose(); onCheckout(); }}>
                {t.cart.checkout} <Icon name="chevron" size={14}/>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

/* ============== Checkout Page ============== */
function CheckoutPage(){
  const [t, lang] = useT();
  const cart = useCart();
  const toast = useToast();
  const [, navigate] = useRoute();
  const products = window.AVStore.products();
  const settings = useStore().settings;

  const items = cart.items.map(c => {
    const p = products.find(p => p.id === c.id);
    return p ? { id:p.id, name: lang==="hi"?p.nameHi:p.nameEn, qty: c.qty, price: p.price, unit:p.unit, icon:p.icon } : null;
  }).filter(Boolean);
  const total = items.reduce((a,i) => a + i.price * i.qty, 0);

  const [form, setForm] = useState({ name:"", phone:"", email:"", address:"", payment:"upi" });
  const [step, setStep] = useState("form"); // form -> pay -> done
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (items.length === 0 && step === "form") {
      // empty cart
    }
  }, []);

  const valid = form.name.trim() && /^\d{10}$/.test(form.phone);

  const submit = () => {
    if (!valid) {
      toast(lang==="hi"?"नाम और 10-अंक फ़ोन भरें":"Enter name and 10-digit phone", "error");
      return;
    }
    if (form.payment === "upi") setStep("pay");
    else placeOrder("Cash on pickup");
  };

  const placeOrder = (paymentLabel) => {
    const sale = window.AVStore.addSale({
      buyerName: form.name,
      buyerPhone: form.phone,
      buyerEmail: form.email,
      address: form.address,
      items: items.map(i => ({id:i.id, name:i.name, qty:i.qty, price:i.price})),
      total,
      payment: paymentLabel,
      source: "shop",
      lang
    });
    setOrder(sale);
    setStep("done");
    cart.clear();
    toast(lang==="hi"?"✅ ऑर्डर सफलतापूर्वक!":"✅ Order placed successfully!", "success");
  };

  if (items.length === 0 && step === "form") {
    return (
      <main className="section">
        <div className="container">
          <div className="card center" style={{padding:60}}>
            <div style={{fontSize:64, marginBottom:12}}>🛒</div>
            <h2 className="serif" style={{fontSize:32, margin:"6px 0"}}>{t.cart.empty}</h2>
            <p className="muted">{t.cart.emptyP}</p>
            <button className="btn btn-primary ripple mt-16" onClick={() => navigate("/shop")}>{t.cart.goShop}</button>
          </div>
        </div>
      </main>
    );
  }

  if (step === "done" && order) return <OrderSuccess order={order} onShopMore={() => navigate("/shop")} settings={settings}/>;
  if (step === "pay") return <PayUPI total={total} onPaid={() => placeOrder("UPI · Paid")} onCancel={() => setStep("form")} settings={settings}/>;

  return (
    <main className="section">
      <div className="container" style={{display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:32, alignItems:"flex-start"}}>
        <div className="card" style={{padding:28}}>
          <span className="eyebrow">{t.checkout.contactH}</span>
          <h2 className="serif" style={{fontSize:30, margin:"6px 0 4px"}}>{t.checkout.title}</h2>
          <p className="muted" style={{marginBottom:20}}>{t.checkout.contactP}</p>

          <div className="col">
            <div className="field">
              <label>{t.checkout.name} *</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Ramesh Yadav"/>
            </div>
            <div className="field">
              <label>{t.checkout.phone} *</label>
              <input className="input" value={form.phone} onChange={e => setForm({...form, phone:e.target.value.replace(/\D/g,"").slice(0,10)})} placeholder="9876543210"/>
            </div>
            <div className="field">
              <label>{t.checkout.email}</label>
              <input className="input" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@email.com"/>
            </div>
            <div className="field">
              <label>{t.checkout.address}</label>
              <textarea className="textarea" rows={2} value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder={lang==="hi"?"पिकअप के लिए पता / नोट":"Address or pickup notes"}/>
            </div>
            <div className="field">
              <label>{t.checkout.payH}</label>
              <div className="row">
                {[
                  {v:"upi", l:t.checkout.payUpi, ic:"💸"},
                  {v:"cash", l:t.checkout.payCash, ic:"💵"}
                ].map(o => (
                  <button key={o.v} type="button" className={"btn ripple " + (form.payment===o.v?"btn-primary":"btn-ghost")} onClick={() => setForm({...form, payment:o.v})}>
                    {o.ic} {o.l}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-lg ripple mt-16" onClick={submit} disabled={!valid}>
              {t.checkout.placeOrder} <Icon name="chevron" size={14}/>
            </button>
          </div>
        </div>

        <OrderSummary items={items} total={total} t={t} lang={lang}/>
      </div>
    </main>
  );
}

function OrderSummary({ items, total, t, lang }){
  return (
    <div className="card" style={{padding:24, position:"sticky", top:90}}>
      <h3 className="serif" style={{fontSize:24, margin:"0 0 16px"}}>{lang==="hi"?"ऑर्डर सारांश":"Order summary"}</h3>
      <div style={{maxHeight:300, overflow:"auto"}}>
        {items.map(i => (
          <div key={i.id} className="cart-item" style={{padding:"10px 0"}}>
            <div className="cart-item-thumb">{i.icon}</div>
            <div>
              <div style={{fontWeight:600, fontSize:13}}>{i.name}</div>
              <div className="muted" style={{fontSize:12}}>{i.qty} × {rupees(i.price)}</div>
            </div>
            <div style={{fontFamily:"var(--serif)", fontSize:16}}>{rupees(i.price * i.qty)}</div>
          </div>
        ))}
      </div>
      <div className="spread" style={{paddingTop:14, borderTop:"1px solid var(--line)"}}>
        <span style={{fontWeight:600}}>{t.cart.total}</span>
        <strong className="serif" style={{fontSize:30, color:"var(--leaf-800)"}}>{rupees(total)}</strong>
      </div>
    </div>
  );
}

function PayUPI({ total, onPaid, onCancel, settings }){
  const [t, lang] = useT();
  const upi = buildUpiLink({ upiId: settings.upiId, name: settings.upiName, amount: total, note: "AgriVeda" });
  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{padding:32, maxWidth:520, margin:"0 auto", textAlign:"center"}}>
          <span className="eyebrow">{t.checkout.payUpi}</span>
          <h2 className="serif" style={{fontSize:32, margin:"8px 0 4px"}}>{rupees(total)}</h2>
          <p className="muted" style={{marginBottom:24}}>{t.checkout.qrInstr}</p>
          <div style={{display:"flex", justifyContent:"center", marginBottom:18}}>
            <div className="qr-frame">
              <QRCode data={upi} size={200}/>
            </div>
          </div>
          <p style={{fontSize:13, marginBottom:8}}><strong>UPI:</strong> {settings.upiId}</p>
          <a href={upi} className="btn btn-saffron ripple mt-8" target="_blank" rel="noreferrer">📱 {lang==="hi"?"UPI ऐप खोलें":"Open UPI app"}</a>
          <div className="row" style={{justifyContent:"center", marginTop:20}}>
            <button className="btn btn-ghost ripple" onClick={onCancel}>{t.common.back}</button>
            <button className="btn btn-primary ripple" onClick={onPaid}>✓ {t.checkout.paid}</button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============== Order Success / Invoice ============== */
function OrderSuccess({ order, onShopMore, settings }){
  const [t, lang] = useT();
  const billMsg = buildBillMessage(order, lang);
  const buyerWa = buildWhatsAppBuyerLink({ phone: order.buyerPhone, message: billMsg });
  const adminWa = buildWhatsAppAdminLink({ adminPhone: settings.whatsappAdmin, message: buildAdminAlert(order) });
  const adminMail = buildMailtoLink({ to: settings.adminEmail, subject:`New AgriVeda Sale ${order.orderId} – ₹${order.total}`, body: buildAdminAlert(order) });

  // Auto-fire admin email & WhatsApp once
  useEffect(() => {
    // Admin notification — open in background only if user requests it; instead, show buttons
  }, []);

  const printBill = () => window.print();
  return (
    <main className="section">
      <div className="container">
        <div className="card center" style={{padding:36, marginBottom:24, background:"linear-gradient(135deg, var(--leaf-100), var(--saffron-soft))"}}>
          <div style={{fontSize:64, marginBottom:8, animation:"floaty 2s ease-in-out infinite"}}>🌿</div>
          <h2 className="serif" style={{fontSize:38, margin:"6px 0", color:"var(--leaf-800)"}}>{t.checkout.successH}</h2>
          <p className="muted" style={{maxWidth:480, margin:"0 auto"}}>{t.checkout.successP}</p>
          <div className="row" style={{justifyContent:"center", marginTop:18, flexWrap:"wrap"}}>
            <a href={buyerWa} target="_blank" rel="noreferrer" className="btn btn-primary ripple" style={{background:"#25D366"}}>
              <Icon name="whatsapp" size={16}/> {t.checkout.sendWA}
            </a>
            <button className="btn btn-saffron ripple" onClick={printBill}>
              <Icon name="download" size={16}/> {t.checkout.downloadPdf}
            </button>
            <a href={adminMail} className="btn btn-ghost ripple">
              ✉️ {t.checkout.emailMe}
            </a>
            <button className="btn btn-soft ripple" onClick={onShopMore}>
              {t.checkout.shopMore}
            </button>
          </div>
          <div className="row" style={{justifyContent:"center", marginTop:14, gap:8}}>
            <a href={adminWa} target="_blank" rel="noreferrer" className="chip chip-line" style={{textDecoration:"none"}}>
              📲 {lang==="hi"?"मालिक को सूचित":"Notify owner"}
            </a>
          </div>
        </div>

        <Invoice order={order} settings={settings}/>
      </div>
    </main>
  );
}

function Invoice({ order, settings }){
  const [t, lang] = useT();
  const itemsTotal = (order.items||[]).reduce((a,i) => a + i.price * i.qty, 0);
  return (
    <div className="invoice-paper" id="invoice-paper">
      <div className="inv-strip"></div>
      <div className="inv-head">
        <div className="inv-brand">
          <div className="inv-brand-mark">🌿</div>
          <div>
            <div className="serif" style={{fontSize:28, lineHeight:1, color:"var(--leaf-800)"}}>AgriVeda</div>
            <div style={{fontSize:12, color:"#666"}}>Organic Inputs Store · Balaghat, MP</div>
          </div>
        </div>
        <div className="inv-meta">
          <div className="num">{order.orderId}</div>
          <div>{new Date(order.ts).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</div>
          <div>{new Date(order.ts).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}</div>
        </div>
      </div>
      <div className="inv-parties">
        <div>
          <h5>{lang==="hi"?"बिल भेजा गया":"Billed to"}</h5>
          <div style={{fontWeight:700, fontSize:15}}>{order.buyerName}</div>
          <div style={{fontSize:13, color:"#555"}}>📞 {order.buyerPhone}</div>
          {order.buyerEmail && <div style={{fontSize:13, color:"#555"}}>✉️ {order.buyerEmail}</div>}
          {order.address && <div style={{fontSize:13, color:"#555"}}>📍 {order.address}</div>}
        </div>
        <div>
          <h5>{lang==="hi"?"बिल भेजने वाला":"Issued by"}</h5>
          <div style={{fontWeight:700, fontSize:15}}>AgriVeda Organic Store</div>
          <div style={{fontSize:13, color:"#555"}}>📞 {settings.adminPhone}</div>
          <div style={{fontSize:13, color:"#555"}}>✉️ {settings.adminEmail}</div>
          {order.studentName && <div style={{fontSize:12, color:"var(--saffron-dark)"}}>Sold by: {order.studentName}</div>}
        </div>
      </div>
      <table className="inv-table">
        <thead>
          <tr><th>#</th><th>{lang==="hi"?"उत्पाद":"Item"}</th><th>{lang==="hi"?"मात्रा":"Qty"}</th><th>{lang==="hi"?"मूल्य":"Price"}</th><th style={{textAlign:"right"}}>{lang==="hi"?"कुल":"Total"}</th></tr>
        </thead>
        <tbody>
          {(order.items||[]).map((i,idx) => (
            <tr key={idx}>
              <td>{idx+1}</td>
              <td><strong>{i.name}</strong></td>
              <td>{i.qty}</td>
              <td>{rupees(i.price)}</td>
              <td style={{textAlign:"right", fontWeight:600}}>{rupees(i.price * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="inv-totals">
        <div className="row" style={{justifyContent:"space-between"}}>
          <span style={{color:"#555"}}>{t.cart.subtotal}</span><span>{rupees(itemsTotal)}</span>
        </div>
        <div className="row" style={{justifyContent:"space-between"}}>
          <span style={{color:"#555"}}>{lang==="hi"?"भुगतान":"Payment"}</span><span>{order.payment}</span>
        </div>
        <div className="row grand" style={{justifyContent:"space-between"}}>
          <span>{t.cart.total}</span><span>{rupees(order.total)}</span>
        </div>
      </div>
      <div className="inv-thanks">
        <h4>{lang==="hi"?"धन्यवाद!":"Thank you!"} 🌱</h4>
        <p style={{margin:0, opacity:.9, fontSize:14}}>
          {lang==="hi"
            ? "जैविक खेती को प्रोत्साहन देने के लिए धन्यवाद। आपके सहयोग से कैंपस में विद्यार्थी सीखते हैं और किसान समृद्ध होते हैं।"
            : "Thank you for choosing organic. Your purchase helps students learn and farmers flourish."}
        </p>
      </div>
      <div className="inv-foot">
        <div>{lang==="hi"?"यह कंप्यूटर-निर्मित बिल है।":"This is a computer-generated bill."}</div>
        <div>agriveda.organic · {settings.adminPhone}</div>
      </div>
    </div>
  );
}

/* ============== Footer ============== */
function Footer({ t }){
  const settings = useStore().settings;
  return (
    <footer className="section section-leaf" style={{padding:"56px 0 28px"}}>
      <div className="container" style={{display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:32}}>
        <div>
          <div className="brand" style={{color:"var(--paper)"}}>
            <BrandLogo size={42}/>
            <div>
              <div className="brand-name serif" style={{color:"var(--paper)"}}>{t.brand}</div>
              <div className="brand-sub" style={{color:"var(--leaf-300)"}}>{t.brandSub}</div>
            </div>
          </div>
          <p style={{color:"var(--leaf-300)", marginTop:16, lineHeight:1.6, fontSize:14}}>{t.footer.tag}</p>
        </div>
        <div>
          <h5 style={{fontSize:12, letterSpacing:".12em", textTransform:"uppercase", color:"var(--leaf-300)"}}>{t.footer.contact}</h5>
          <div style={{fontSize:14, lineHeight:1.9}}>
            <div>📞 +91 {settings.adminPhone}</div>
            <div>✉️ {settings.adminEmail}</div>
            <div>📍 {t.footer.address}</div>
          </div>
        </div>
        <div>
          <h5 style={{fontSize:12, letterSpacing:".12em", textTransform:"uppercase", color:"var(--leaf-300)"}}>Links</h5>
          <div style={{display:"flex", flexDirection:"column", fontSize:14, lineHeight:2}}>
            <a href="#/home" style={{color:"var(--paper)", textDecoration:"none"}}>{t.nav.home}</a>
            <a href="#/shop" style={{color:"var(--paper)", textDecoration:"none"}}>{t.nav.shop}</a>
            <a href="#/doctor" style={{color:"var(--paper)", textDecoration:"none"}}>{t.nav.doctor}</a>
            <a href="#/chat" style={{color:"var(--paper)", textDecoration:"none"}}>{t.nav.chat}</a>
          </div>
        </div>
        <div>
          <h5 style={{fontSize:12, letterSpacing:".12em", textTransform:"uppercase", color:"var(--leaf-300)"}}>Portals</h5>
          <div style={{display:"flex", flexDirection:"column", fontSize:14, lineHeight:2}}>
            <a href="#/student" style={{color:"var(--paper)", textDecoration:"none"}}>{t.nav.student}</a>
            <a href="#/admin" style={{color:"var(--paper)", textDecoration:"none"}}>{t.nav.admin}</a>
          </div>
        </div>
      </div>
      <div className="container" style={{borderTop:"1px solid rgba(255,255,255,.1)", marginTop:36, paddingTop:18, fontSize:12, color:"var(--leaf-300)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8}}>
        <div>{t.footer.copyright}</div>
        <div>v1.0 · Built with care 🌱</div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  HomePage, ShopPage, CartDrawer, CheckoutPage, OrderSuccess, Invoice, Footer, ProductCard
});
