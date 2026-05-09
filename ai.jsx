// =============================================================
// AgriVeda — AI Plant Doctor & AI Farming Assistant
// =============================================================
// Uses window.claude.complete when available, with graceful
// offline fallback to the curated knowledge base.

/* ============== AI helper ============== */
async function aiAsk({ prompt, system, lang }) {
  // Try Claude
  if (window.claude && typeof window.claude.complete === "function") {
    try {
      const r = await window.claude.complete({
        messages: [{ role: "user", content: prompt }],
        system: system
      });
      if (typeof r === "string") return r;
      return r?.completion || r?.text || JSON.stringify(r);
    } catch (e) {
      console.warn("[AI] claude.complete failed; fallback used", e);
    }
  }
  // Fallback to local knowledge base
  return localFallback(prompt, lang);
}

function localFallback(text, lang) {
  const kb = window.AGRIVEDA_KNOWLEDGE;
  const lower = (text || "").toLowerCase();
  // Try matching symptoms
  for (const s of kb.symptoms) {
    if (s.keys.some(k => lower.includes(k.toLowerCase()))) {
      return lang === "hi" ? s.hi : s.en;
    }
  }
  // Default: pick a helpful generic answer
  if (lang === "hi") {
    return "🌿 **सामान्य सलाह:** मिट्टी और पौधे के स्वास्थ्य के लिए हर महीने 200 लीटर/एकड़ Jeevamrit और 1 टन/एकड़ Vermicompost ज़रूर डालें। कीट या रोग की समस्या हो तो 7 दिन में Neemastra और 15 दिन में Dashparni 3% का छिड़काव करें। अधिक सटीक उत्तर के लिए कृपया फसल का नाम, अवस्था और लक्षण विस्तार से बताएं।";
  }
  return "🌿 **General advice:** For healthy soil & plants, apply 200 L/acre Jeevamrit and 1 ton/acre Vermicompost monthly. For any pest or disease, spray Neemastra weekly and 3% Dashparni fortnightly. For a more precise answer, please describe the crop, growth stage and exact symptoms.";
}

/* Markdown-lite for AI responses */
function renderMD(text) {
  if (!text) return null;
  const lines = String(text).split("\n");
  const out = [];
  let listBuf = null;
  let listType = null;
  const flushList = () => {
    if (listBuf && listBuf.length) {
      const Tag = listType === "ol" ? "ol" : "ul";
      out.push(<Tag key={out.length}>{listBuf.map((x,i) => <li key={i} dangerouslySetInnerHTML={{__html: inline(x)}}/>)}</Tag>);
    }
    listBuf = null; listType = null;
  };
  function inline(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }
  lines.forEach((raw) => {
    const ln = raw.trim();
    const olMatch = ln.match(/^(\d+)\.\s+(.*)/);
    const ulMatch = ln.match(/^[-•*]\s+(.*)/);
    if (olMatch) {
      if (listType !== "ol") flushList();
      listBuf = listBuf || [];
      listType = "ol";
      listBuf.push(olMatch[2]);
    } else if (ulMatch) {
      if (listType !== "ul") flushList();
      listBuf = listBuf || [];
      listType = "ul";
      listBuf.push(ulMatch[1]);
    } else if (ln === "") {
      flushList();
    } else if (/^#{1,3}\s+/.test(ln)) {
      flushList();
      out.push(<h4 key={out.length} style={{margin:"10px 0 4px", fontFamily:"var(--serif)", fontSize:18}} dangerouslySetInnerHTML={{__html: inline(ln.replace(/^#{1,3}\s+/, ""))}}/>);
    } else {
      flushList();
      out.push(<p key={out.length} style={{margin:"6px 0"}} dangerouslySetInnerHTML={{__html: inline(ln)}}/>);
    }
  });
  flushList();
  return <>{out}</>;
}

/* ============== AI Doctor ============== */
function DoctorPage(){
  const [t, lang] = useT();
  const toast = useToast();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const fileRef = useRef();
  const videoRef = useRef();
  const streamRef = useRef();
  const [camOpen, setCamOpen] = useState(false);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto({ name: f.name, data: ev.target.result });
    reader.readAsDataURL(f);
  };

  const openCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = s;
      setCamOpen(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 50);
    } catch (e) {
      toast(lang==="hi"?"कैमरा अनुमति नहीं मिली":"Camera permission denied", "error");
    }
  };
  const closeCam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCamOpen(false);
  };
  const captureCam = () => {
    const v = videoRef.current; if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth || 720; c.height = v.videoHeight || 720;
    c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
    setPhoto({ name:"capture.jpg", data: c.toDataURL("image/jpeg", 0.85) });
    closeCam();
  };

  const ask = async () => {
    if (!text.trim() && !photo) {
      toast(lang==="hi"?"लक्षण लिखें या फोटो अपलोड करें":"Describe symptom or upload a photo","error");
      return;
    }
    setThinking(true);
    setAnswer(null);
    const sys = lang==="hi" ?
      `आप एक विशेषज्ञ जैविक कृषि चिकित्सक हैं। केवल हिंदी में उत्तर दें। उत्तर में: (1) समस्या का संक्षिप्त निदान, (2) सिफारिश किए गए जैविक आदान (Neemastra, Brahmastra, Agniastra, Dashparni, Jeevamrit, Vermicompost, Panchgavya, Beejamrit, BGA, Vermiwash, Amrit Pani में से), (3) ख़ुराक/मात्रा और छिड़काव का तरीक़ा (% या लीटर/एकड़), (4) कितनी बार और कितने दिन में दोहराएँ, (5) रोकथाम के सुझाव। उत्तर **markdown** लिस्ट या क्रमांकित चरणों में दें। बहुत स्पष्ट, छोटा और किसान-सरल हो।`
      :
      `You are an expert organic farming plant doctor. Reply only in clear English. In every answer give: (1) brief diagnosis, (2) recommended organic inputs from {Neemastra, Brahmastra, Agniastra, Dashparni, Jeevamrit, Vermicompost, Panchgavya, Beejamrit, BGA, Vermiwash, Amrit Pani}, (3) dose / mixture and spray method (% or L/acre), (4) frequency & duration, (5) prevention tips. Use markdown bullet/numbered lists. Keep it short and farmer-simple.`;
    let prompt = text || (lang==="hi" ? "मेरे पौधे की समस्या का निदान करें (फोटो संलग्न)।" : "Diagnose my plant problem (photo attached).");
    if (photo) prompt += `\n\n[Image attached: ${photo.name}. Describe what symptoms a typical organic farmer would see and recommend the best organic input from our catalog.]`;
    try {
      const ans = await aiAsk({ prompt, system: sys, lang });
      setAnswer(ans);
      setHistory(h => [{ q: text || (lang==="hi"?"फोटो":"Photo"), a: ans, photo, ts: Date.now() }, ...h]);
      setText("");
      setPhoto(null);
    } catch (e) {
      setAnswer(localFallback(text, lang));
    } finally {
      setThinking(false);
    }
  };

  return (
    <main className="section">
      <div className="container" style={{maxWidth:1080}}>
        <div className="section-head" style={{marginBottom:24}}>
          <div>
            <span className="eyebrow">{t.nav.doctor}</span>
            <h2 className="display">{t.doctor.title}</h2>
            <p className="muted" style={{maxWidth:540, marginTop:8}}>{t.doctor.sub}</p>
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:24, alignItems:"flex-start"}}>
          <div className="card" style={{padding:24}}>
            <div className="row" style={{marginBottom:14}}>
              <button className="btn btn-soft ripple" onClick={openCam}><Icon name="cam" size={14}/> {t.doctor.camera}</button>
              <button className="btn btn-soft ripple" onClick={() => fileRef.current?.click()}>📷 {t.doctor.upload}</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick}/>
            </div>

            {photo && (
              <div style={{position:"relative", marginBottom:14, borderRadius:14, overflow:"hidden"}}>
                <img src={photo.data} alt="upload" style={{width:"100%", maxHeight:280, objectFit:"cover"}}/>
                <button className="btn btn-icon ripple" style={{position:"absolute", top:8, right:8, background:"rgba(0,0,0,.55)", color:"white", border:"none"}} onClick={() => setPhoto(null)}>✕</button>
              </div>
            )}

            <div className="field">
              <label>{t.doctor.describe}</label>
              <textarea
                className="textarea"
                rows={4}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t.doctor.placeholderEx}
              />
            </div>

            <button className="btn btn-primary btn-lg btn-block ripple mt-16" onClick={ask} disabled={thinking}>
              {thinking ? <span><span className="typing-dots"><span></span><span></span><span></span></span> {t.doctor.thinking}</span> : <>🩺 {t.doctor.ask}</>}
            </button>
          </div>

          <div className="card" style={{padding:24, background:"var(--cream)"}}>
            <div className="row" style={{marginBottom:12}}>
              <span className="chip">{lang==="hi"?"उत्तर":"Diagnosis"}</span>
              {!thinking && answer && <span className="chip chip-saffron">AI</span>}
            </div>
            {thinking && (
              <div className="muted">
                <span className="typing-dots"><span></span><span></span><span></span></span> {t.doctor.thinking}
              </div>
            )}
            {!thinking && !answer && (
              <div className="muted center" style={{padding:"40px 0"}}>
                <div style={{fontSize:48, marginBottom:6}}>🌿</div>
                <p style={{margin:0}}>{lang==="hi"?"लक्षण बताएँ या फोटो भेजें — सेकंडों में जैविक उपचार पाएँ।":"Describe a symptom or send a photo — get an organic remedy in seconds."}</p>
              </div>
            )}
            {!thinking && answer && (
              <div style={{lineHeight:1.55, fontSize:14.5}}>{renderMD(answer)}</div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-32">
            <h3 className="serif" style={{fontSize:24, margin:"0 0 14px"}}>{lang==="hi"?"पिछले निदान":"Past diagnoses"}</h3>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14}}>
              {history.map((h,i) => (
                <div key={i} className="card" style={{padding:16}}>
                  {h.photo && <img src={h.photo.data} style={{width:"100%", height:120, objectFit:"cover", borderRadius:10, marginBottom:10}}/>}
                  <div style={{fontSize:12, color:"var(--slate-soft)", marginBottom:4}}>{formatDate(h.ts)} {formatTime(h.ts)}</div>
                  <div style={{fontWeight:600, fontSize:14, marginBottom:6}}>"{h.q}"</div>
                  <div style={{fontSize:13, color:"var(--ink-soft)", lineHeight:1.5, maxHeight:140, overflow:"hidden"}}>{renderMD(h.a)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={camOpen} onClose={closeCam} title={t.doctor.camera} footer={<>
        <button className="btn btn-ghost ripple" onClick={closeCam}>{t.common.cancel}</button>
        <button className="btn btn-primary ripple" onClick={captureCam}>📸 Capture</button>
      </>}>
        <div style={{borderRadius:14, overflow:"hidden", background:"black", aspectRatio:"4/3"}}>
          <video ref={videoRef} autoPlay playsInline style={{width:"100%", height:"100%", objectFit:"cover"}}/>
        </div>
      </Modal>
      <Footer t={t}/>
    </main>
  );
}

/* ============== AI Chat ============== */
function ChatPage(){
  const [t, lang] = useT();
  const toast = useToast();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef();
  const recRef = useRef();
  const [recOn, setRecOn] = useState(false);

  useEffect(() => {
    const last = scrollRef.current;
    if (last) last.scrollTop = last.scrollHeight;
  }, [msgs, thinking]);

  // Suggested prompts
  const suggestions = lang === "hi" ? [
    "मेरे टमाटर के पत्ते मुड़ रहे हैं",
    "वर्मीकम्पोस्ट कैसे बनाएँ?",
    "धान में नाइट्रोजन के लिए क्या डालूँ?",
    "पंचगव्य का छिड़काव कैसे करें?"
  ] : [
    "My tomato leaves are curling",
    "How to make vermicompost?",
    "What organic input gives nitrogen for paddy?",
    "How to spray Panchgavya?"
  ];

  const send = async (override) => {
    const q = (override ?? input).trim();
    if (!q) return;
    setMsgs(m => [...m, { role:"user", text: q }]);
    setInput("");
    setThinking(true);
    const sys = lang==="hi" ?
      `आप AgriVeda के विशेषज्ञ कृषि सहायक हैं — शून्य बजट प्राकृतिक खेती (ZBNF), जैविक खेती, वर्मीकम्पोस्ट, BGA, और Neemastra/Brahmastra/Agniastra/Dashparni/Jeevamrit/Beejamrit/Panchgavya/Vermiwash/Amrit Pani के बारे में। केवल हिंदी में उत्तर दें। उत्तर **markdown चरणों या बुलेट सूची** में दें ताकि किसान आसानी से समझे। मात्रा (L/acre, %, kg/100kg बीज) ज़रूर बताएँ। ज़रूरी हो तो AgriVeda कैटलॉग से सही उत्पाद सुझाएँ।`
      :
      `You are AgriVeda's expert farming assistant — Zero-Budget Natural Farming (ZBNF), organic farming, vermicomposting, BGA, and the inputs: Neemastra/Brahmastra/Agniastra/Dashparni/Jeevamrit/Beejamrit/Panchgavya/Vermiwash/Amrit Pani. Reply ONLY in English. Format answers as **markdown numbered or bullet lists** so a farmer can follow step-by-step. ALWAYS include doses (L/acre, %, kg/100kg seed). Suggest the right AgriVeda product when relevant.`;
    try {
      const ans = await aiAsk({ prompt: q, system: sys, lang });
      setMsgs(m => [...m, { role:"ai", text: ans }]);
    } catch (e) {
      setMsgs(m => [...m, { role:"ai", text: localFallback(q, lang) }]);
    } finally {
      setThinking(false);
    }
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast(lang==="hi"?"वॉइस इस ब्राउज़र में नहीं":"Voice not available in this browser","error"); return; }
    const r = new SR();
    r.lang = lang === "hi" ? "hi-IN" : "en-IN";
    r.interimResults = false;
    r.onresult = e => { setInput(e.results[0][0].transcript); setRecOn(false); };
    r.onerror = () => setRecOn(false);
    r.onend = () => setRecOn(false);
    r.start();
    recRef.current = r;
    setRecOn(true);
  };
  const stopVoice = () => { recRef.current?.stop(); setRecOn(false); };

  return (
    <main className="section">
      <div className="container" style={{maxWidth:880}}>
        <div className="section-head" style={{marginBottom:18}}>
          <div>
            <span className="eyebrow">{t.nav.chat}</span>
            <h2 className="display">{t.chat.title}</h2>
            <p className="muted" style={{maxWidth:540, marginTop:8}}>{t.chat.sub}</p>
          </div>
          <button className="btn btn-ghost ripple" onClick={() => setMsgs([])}>{t.chat.clear}</button>
        </div>

        <div className="card" style={{padding:0, overflow:"hidden", display:"flex", flexDirection:"column", height:560}}>
          <div ref={scrollRef} style={{flex:1, overflow:"auto"}}>
            {msgs.length === 0 ? (
              <div className="chat-stack" style={{justifyContent:"center", alignItems:"center", flex:1, minHeight:420}}>
                <div style={{textAlign:"center", padding:"40px 20px"}}>
                  <div style={{fontSize:54, marginBottom:8}}>🌾</div>
                  <h3 className="serif" style={{fontSize:24, margin:"6px 0"}}>{lang==="hi"?"क्या पूछना चाहेंगे?":"What can I help you with?"}</h3>
                  <p className="muted">{t.chat.sub}</p>
                  <div className="row" style={{justifyContent:"center", marginTop:20, gap:8}}>
                    {suggestions.map((q,i) => (
                      <button key={i} className="chip chip-line ripple" onClick={() => send(q)} style={{cursor:"pointer", border:"1px solid var(--line)"}}>{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="chat-stack">
                {msgs.map((m,i) => (
                  <div key={i} className={"chat-msg " + m.role}>{m.role==="ai" ? renderMD(m.text) : m.text}</div>
                ))}
                {thinking && <div className="chat-msg ai"><span className="typing-dots"><span></span><span></span><span></span></span></div>}
              </div>
            )}
          </div>
          <div style={{padding:14, borderTop:"1px solid var(--line)", background:"var(--cream)", display:"flex", gap:8, alignItems:"flex-end"}}>
            <button className={"btn-icon ripple" + (recOn?" pulse":"")} onClick={recOn ? stopVoice : startVoice} title="Voice" style={recOn?{background:"var(--saffron)", color:"white", border:"none"}:{}}>
              <Icon name="mic" size={16}/>
            </button>
            <textarea
              className="textarea"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.chat.placeholder}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              style={{minHeight:46, maxHeight:120, padding:"12px 14px", borderRadius:24, border:"1.5px solid var(--line)"}}
            />
            <button className="btn btn-primary ripple" onClick={() => send()} disabled={thinking || !input.trim()} style={{borderRadius:999, padding:"12px 18px"}}>
              <Icon name="send" size={16}/>
            </button>
          </div>
        </div>
      </div>
      <Footer t={t}/>
    </main>
  );
}

Object.assign(window, { DoctorPage, ChatPage, aiAsk, renderMD, localFallback });
