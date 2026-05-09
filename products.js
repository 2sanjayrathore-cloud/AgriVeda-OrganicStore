// =============================================================
// AgriVeda — Product catalog + Organic farming knowledge base
// =============================================================
// All product info has Hindi & English bilingual descriptions and
// farmer-friendly application instructions, doses and benefits.

window.AGRIVEDA_PRODUCTS = [
  {
    id: "earthworm",
    sku: "AV-EW-01",
    cat: "Inputs",
    nameEn: "Earthworms (Eisenia fetida)",
    nameHi: "केंचुआ (आइसीनिया फेटिडा)",
    price: 800, unit: "kg", stock: 25,
    icon: "🪱", theme: "earth",
    featured: true,
    descEn: "Live red wriggler earthworms, the engine of vermicomposting. Multiplies fast, eats organic waste, produces premium worm castings.",
    descHi: "जीवित लाल केंचुए, वर्मीकम्पोस्ट का इंजन। तेज़ी से बढ़ते हैं, जैविक कचरा खाते हैं, बेहतरीन वर्मी खाद बनाते हैं।",
    usesEn: ["Start your own vermicompost bed", "Healthy soil biology", "Fast-multiplying breed"],
    usesHi: ["अपनी वर्मीकम्पोस्ट बेड शुरू करें", "स्वस्थ मिट्टी जीव विज्ञान", "तेज़ी से बढ़ने वाली नस्ल"]
  },
  {
    id: "vermicompost",
    sku: "AV-VC-01",
    cat: "Compost",
    nameEn: "Vermicompost",
    nameHi: "वर्मीकम्पोस्ट",
    price: 10, unit: "kg", stock: 1500,
    icon: "🌱", theme: "leaf",
    featured: true,
    descEn: "Rich, dark organic compost made by earthworms. Improves soil structure, water retention and nutrient supply naturally.",
    descHi: "केंचुओं द्वारा बनाई गई समृद्ध, गहरी जैविक खाद। मिट्टी की संरचना, जल धारण और पोषक आपूर्ति को प्राकृतिक रूप से बेहतर बनाती है।",
    usesEn: ["2–4 tons/acre as basal", "Hand-full per pot for kitchen garden", "Mix with pot soil 1:3 ratio"],
    usesHi: ["आधार के रूप में 2–4 टन/एकड़", "गमले के लिए मुट्ठी भर", "गमले की मिट्टी में 1:3 अनुपात में मिलाएँ"]
  },
  {
    id: "vermicompost-enriched",
    sku: "AV-VCE-01",
    cat: "Compost",
    nameEn: "Enriched Vermicompost",
    nameHi: "समृद्ध वर्मीकम्पोस्ट",
    price: 15, unit: "kg", stock: 600,
    icon: "✨", theme: "leaf",
    descEn: "Vermicompost fortified with neem cake, rock phosphate and bio-cultures. Higher NPK and natural pest deterrent.",
    descHi: "नीम खली, रॉक फॉस्फेट और जैव-संवर्धन से युक्त वर्मीकम्पोस्ट। अधिक NPK और प्राकृतिक कीट प्रतिरोधक।",
    usesEn: ["1.5–3 tons/acre", "Better for nutrient-hungry crops", "Doubles as pest deterrent"],
    usesHi: ["1.5–3 टन/एकड़", "अधिक पोषक चाहने वाली फसलों के लिए", "कीट प्रतिरोधक भी"]
  },
  {
    id: "vermiwash",
    sku: "AV-VW-01",
    cat: "Liquid",
    nameEn: "Vermiwash",
    nameHi: "वर्मीवॉश",
    price: 60, unit: "L", stock: 200,
    icon: "💧", theme: "leaf",
    descEn: "Liquid extract from vermicompost — rich in growth hormones, enzymes and beneficial microbes. Best foliar tonic.",
    descHi: "वर्मीकम्पोस्ट से निकाला गया तरल — विकास हार्मोन, एंजाइम और लाभदायक सूक्ष्मजीवों से समृद्ध। सबसे अच्छा पत्तों पर छिड़काव टॉनिक।",
    usesEn: ["Dilute 1:10 with water", "Foliar spray every 10–15 days", "Use early morning or evening"],
    usesHi: ["1:10 पानी में मिलाएँ", "हर 10–15 दिन पत्तों पर छिड़काव", "सुबह जल्दी या शाम को उपयोग"]
  },
  {
    id: "bga",
    sku: "AV-BGA-01",
    cat: "Bio-fertilizer",
    nameEn: "BGA (Blue Green Algae)",
    nameHi: "बीजीए (नीली हरी शैवाल)",
    price: 120, unit: "kg", stock: 80,
    icon: "🟢", theme: "leaf",
    descEn: "Cyanobacterial bio-fertilizer that fixes atmospheric nitrogen in flooded paddy fields. Reduces urea use by 25–30%.",
    descHi: "साइनोबैक्टीरियल जैव-उर्वरक जो धान के खेतों में वायुमंडलीय नाइट्रोजन का स्थिरीकरण करता है। यूरिया उपयोग 25-30% कम करता है।",
    usesEn: ["10 kg/acre in standing water", "Apply 7 days after transplant", "Maintain 2–4 cm water depth"],
    usesHi: ["10 किग्रा/एकड़ खड़े पानी में", "रोपाई के 7 दिन बाद डालें", "2–4 सेमी पानी बनाए रखें"]
  },
  {
    id: "brahmastra",
    sku: "AV-BRH-01",
    cat: "Botanical",
    nameEn: "Brahmastra",
    nameHi: "ब्रह्मास्त्र",
    price: 90, unit: "L", stock: 90,
    icon: "🌿", theme: "saffron",
    descEn: "Powerful botanical insecticide brewed from neem, custard apple, papaya and pomegranate leaves. Strong against pod borers and caterpillars.",
    descHi: "नीम, सीताफल, पपीता और अनार की पत्तियों से बना शक्तिशाली वानस्पतिक कीटनाशक। फली छेदक और कैटरपिलर के विरुद्ध प्रभावी।",
    usesEn: ["3% spray (300ml in 10L water)", "Spray every 10–12 days", "Best for cotton, pulses, vegetables"],
    usesHi: ["3% छिड़काव (10 लीटर पानी में 300 मि.ली.)", "हर 10–12 दिन में छिड़काव", "कपास, दलहन, सब्ज़ियों के लिए उत्तम"]
  },
  {
    id: "neemastra",
    sku: "AV-NEE-01",
    cat: "Botanical",
    nameEn: "Neemastra",
    nameHi: "नीमास्त्र",
    price: 70, unit: "L", stock: 130,
    icon: "🍃", theme: "leaf",
    descEn: "Cow urine + neem leaves + cow dung based formulation for sucking pests like aphids, jassids, white-fly and mealy bug.",
    descHi: "गोमूत्र + नीम पत्ती + गाय गोबर आधारित घोल — माहू, हरा तेला, सफ़ेद मक्खी और मीली बग के विरुद्ध।",
    usesEn: ["Use undiluted as foliar spray", "Spray every 7–10 days", "Safe for beneficial insects"],
    usesHi: ["बिना पतला किए पत्तों पर छिड़काव", "हर 7–10 दिन छिड़काव", "मित्र कीटों के लिए सुरक्षित"]
  },
  {
    id: "agniastra",
    sku: "AV-AGN-01",
    cat: "Botanical",
    nameEn: "Agniastra",
    nameHi: "अग्निअस्त्र",
    price: 95, unit: "L", stock: 75,
    icon: "🔥", theme: "saffron",
    descEn: "Hot brew of green chilli, garlic, neem, and tobacco — controls leaf-eating caterpillars, fruit borers and stem borers.",
    descHi: "हरी मिर्च, लहसुन, नीम और तंबाकू का गरम काढ़ा — पत्ती खाने वाले कैटरपिलर, फल छेदक और तना छेदक नियंत्रण के लिए।",
    usesEn: ["6–8% spray", "Repeat after 7 days if needed", "Ideal for tomato, brinjal, okra"],
    usesHi: ["6–8% छिड़काव", "जरूरत हो तो 7 दिन बाद दोहराएँ", "टमाटर, बैंगन, भिंडी के लिए उत्तम"]
  },
  {
    id: "panchparni",
    sku: "AV-PP-01",
    cat: "Botanical",
    nameEn: "Panchparni Kashayam",
    nameHi: "पंचपर्णी काढ़ा",
    price: 75, unit: "L", stock: 60,
    icon: "🌾", theme: "leaf",
    descEn: "Five-leaf decoction (neem, custard apple, papaya, guava, datura). Broad-spectrum prophylactic spray.",
    descHi: "पाँच पत्ती का काढ़ा (नीम, सीताफल, पपीता, अमरूद, धतूरा)। विस्तृत-सीमा रोकथाम छिड़काव।",
    usesEn: ["3% foliar spray every 15 days", "Preventive against early infestation", "Use fresh within 1 week"],
    usesHi: ["हर 15 दिन में 3% पत्तों पर छिड़काव", "शुरुआती संक्रमण से रोकथाम", "1 सप्ताह में ताज़ा उपयोग"]
  },
  {
    id: "astparni",
    sku: "AV-AP-01",
    cat: "Botanical",
    nameEn: "Astparni Kashayam",
    nameHi: "अष्टपर्णी काढ़ा",
    price: 85, unit: "L", stock: 50,
    icon: "🌳", theme: "leaf",
    descEn: "Eight-leaf decoction — stronger than panchparni. Targets stubborn pest pressures and fungal flare-ups.",
    descHi: "आठ पत्ती का काढ़ा — पंचपर्णी से ज़्यादा शक्तिशाली। ज़िद्दी कीट और फफूँद के लिए।",
    usesEn: ["3% foliar spray", "Weekly during heavy infestation", "Combines with neemastra for synergy"],
    usesHi: ["3% पत्तों पर छिड़काव", "भारी संक्रमण में साप्ताहिक", "नीमास्त्र के साथ मिलाकर अधिक प्रभाव"]
  },
  {
    id: "dashparni",
    sku: "AV-DP-01",
    cat: "Botanical",
    nameEn: "Dashparni Ark",
    nameHi: "दशपर्णी अर्क",
    price: 110, unit: "L", stock: 40,
    icon: "🌲", theme: "leaf",
    descEn: "Ten-leaf concentrate — the strongest botanical pesticide in natural farming. Stays effective for 6 months.",
    descHi: "दस पत्ती सांद्र — प्राकृतिक खेती का सबसे शक्तिशाली वानस्पतिक कीटनाशक। 6 महीने तक प्रभावी रहता है।",
    usesEn: ["3% spray, all crops", "Most effective in mixed orchards", "Long shelf life"],
    usesHi: ["3% छिड़काव, सभी फसलें", "मिश्रित बागों में सबसे प्रभावी", "लंबा शेल्फ जीवन"]
  },
  {
    id: "beejamrit",
    sku: "AV-BJ-01",
    cat: "Seed-treat",
    nameEn: "Beejamrit",
    nameHi: "बीजामृत",
    price: 50, unit: "L", stock: 100,
    icon: "🌰", theme: "earth",
    descEn: "Seed treatment liquid — protects seeds from soil and seed-borne pathogens. Boosts germination significantly.",
    descHi: "बीज उपचार तरल — बीजों को मिट्टी व बीज-जनित रोगाणुओं से बचाता है। अंकुरण काफी बढ़ाता है।",
    usesEn: ["Coat 100 kg seed with 5 L beejamrit", "Dry in shade before sowing", "Use within 24 hours"],
    usesHi: ["100 किग्रा बीज को 5 लीटर बीजामृत से लेप करें", "बुवाई से पहले छाँव में सुखाएँ", "24 घंटे में उपयोग"]
  },
  {
    id: "jeevamrit",
    sku: "AV-JV-01",
    cat: "Liquid",
    nameEn: "Jeevamrit",
    nameHi: "जीवामृत",
    price: 40, unit: "L", stock: 250,
    icon: "🥛", theme: "leaf",
    featured: true,
    descEn: "Microbial culture from cow dung, urine, jaggery, gram flour and forest soil. The heart of Zero-Budget Natural Farming.",
    descHi: "गाय गोबर, गोमूत्र, गुड़, बेसन और वन मिट्टी से सूक्ष्मजीव संवर्धन। शून्य बजट प्राकृतिक खेती का हृदय।",
    usesEn: ["200 L/acre via irrigation water", "Foliar 10% spray every 15 days", "Apply twice a month"],
    usesHi: ["200 लीटर/एकड़ सिंचाई जल से", "हर 15 दिन 10% पत्तों पर छिड़काव", "महीने में दो बार लागू करें"]
  },
  {
    id: "amritpani",
    sku: "AV-AM-01",
    cat: "Liquid",
    nameEn: "Amrit Pani",
    nameHi: "अमृत पानी",
    price: 35, unit: "L", stock: 220,
    icon: "💦", theme: "leaf",
    descEn: "Simple, fast-fermenting microbial drink for soil. Energizes existing microbiome, easy for new farmers.",
    descHi: "सरल, जल्दी किण्वित होने वाला मिट्टी का सूक्ष्मजीव पेय। मौजूदा सूक्ष्मजीव-तंत्र को सक्रिय करता है, नए किसानों के लिए आसान।",
    usesEn: ["100 L/acre with irrigation", "Spray foliar 5% every 15 days", "Cheaper alternative to jeevamrit"],
    usesHi: ["100 लीटर/एकड़ सिंचाई के साथ", "हर 15 दिन 5% पत्तों पर छिड़काव", "जीवामृत का सस्ता विकल्प"]
  },
  {
    id: "panchgavya",
    sku: "AV-PG-01",
    cat: "Tonic",
    nameEn: "Panchgavya",
    nameHi: "पंचगव्य",
    price: 130, unit: "L", stock: 65,
    icon: "🐄", theme: "saffron",
    descEn: "Sacred 5-cow-product growth tonic (dung, urine, milk, curd, ghee + banana, jaggery, coconut). Elite plant tonic.",
    descHi: "पवित्र 5 गव्य वृद्धि टॉनिक (गोबर, गोमूत्र, दूध, दही, घी + केला, गुड़, नारियल)। श्रेष्ठ पादप टॉनिक।",
    usesEn: ["3% foliar spray every 15 days", "Boosts flowering and fruit-set", "Improves crop quality and shelf-life"],
    usesHi: ["हर 15 दिन 3% पत्तों पर छिड़काव", "फूल और फल बढ़ाता है", "फसल गुणवत्ता व भंडारण क्षमता बेहतर"]
  }
];

window.AGRIVEDA_KNOWLEDGE = {
  // Pest / disease symptom map → recommended organic input
  symptoms: [
    { keys: ["aphid","माहू","sucking","yellow leaves","curl"], rec: ["neemastra","brahmastra"], en: "Sucking pests (aphids, jassids, white-fly). Spray Neemastra (undiluted) every 7 days. If heavy, alternate with 3% Brahmastra.", hi: "रसचूसक कीट (माहू, हरा तेला, सफ़ेद मक्खी)। हर 7 दिन Neemastra (बिना पतला) छिड़कें। अधिक प्रकोप पर 3% Brahmastra से बदल-बदल कर छिड़काव।" },
    { keys: ["caterpillar","कैटरपिलर","leaf eat","hole in leaf","borer","फल छेदक","तना छेदक"], rec: ["agniastra","brahmastra"], en: "Caterpillars/borers. Spray Agniastra at 6-8% concentration. Repeat after 7 days. For pod/fruit borers add 3% Brahmastra.", hi: "कैटरपिलर/छेदक। 6–8% Agniastra का छिड़काव। 7 दिन बाद दोहराएँ। फली/फल छेदक के लिए 3% Brahmastra मिलाएँ।" },
    { keys: ["fungus","powdery","फफूँद","leaf spot","blight","झुलसा","धब्बा"], rec: ["dashparni","panchgavya"], en: "Fungal disease (blight, leaf spot, powdery mildew). Spray 3% Dashparni at 7-day intervals. Add 3% Panchgavya as tonic to boost plant immunity.", hi: "फफूँद रोग (झुलसा, धब्बा, चूर्णिल आसिता)। 3% Dashparni हर 7 दिन। पौधे की प्रतिरोधकता के लिए 3% Panchgavya टॉनिक मिलाएँ।" },
    { keys: ["weak","slow growth","yellow plant","stunt","कमज़ोर","पीला"], rec: ["jeevamrit","panchgavya","vermicompost"], en: "Weak/yellow plants — likely poor soil microbiome. Apply 200 L/acre Jeevamrit with irrigation. Top-dress 1 ton/acre Vermicompost. Foliar 3% Panchgavya every 15 days.", hi: "कमज़ोर/पीले पौधे — मिट्टी का सूक्ष्मजीव-तंत्र कमज़ोर। 200 लीटर/एकड़ Jeevamrit सिंचाई जल से। 1 टन/एकड़ Vermicompost ऊपरी परत पर। हर 15 दिन 3% Panchgavya पत्तों पर।" },
    { keys: ["seed","germination","अंकुरण","sowing"], rec: ["beejamrit"], en: "Use Beejamrit seed treatment: 5 L per 100 kg seed, dry in shade, sow within 24 hours. Improves germination by 20-30%.", hi: "बीज उपचार Beejamrit: 100 किग्रा बीज पर 5 लीटर, छाँव में सुखाकर 24 घंटे में बोएँ। अंकुरण 20-30% बेहतर।" },
    { keys: ["paddy","rice","धान","nitrogen"], rec: ["bga","jeevamrit"], en: "Paddy nitrogen support: apply 10 kg/acre BGA in standing water 7 days after transplant. Combine with monthly 200 L Jeevamrit. Reduces urea use 25-30%.", hi: "धान में नाइट्रोजन: रोपाई के 7 दिन बाद खड़े पानी में 10 किग्रा/एकड़ BGA। मासिक 200 लीटर Jeevamrit के साथ। यूरिया 25-30% कम।" },
    { keys: ["flower","fruit","fruiting","फूल","फल"], rec: ["panchgavya","vermiwash"], en: "Flowering & fruiting boost: foliar spray 3% Panchgavya at flowering, then 1:10 Vermiwash at fruit-set every 10-15 days.", hi: "फूल व फल वृद्धि: फूल आने पर 3% Panchgavya, फल आने पर हर 10–15 दिन 1:10 Vermiwash पत्तों पर।" }
  ],
  // Crop calendar quick recipes
  recipes: {
    en: [
      { title: "Vermicompost Bed (10 ft × 3 ft)", steps: ["Lay 4 inch dry leaves at base", "Add 6 inch fresh cow dung + crop residue (2-3 days old)", "Release 2 kg earthworms", "Maintain 40-50% moisture, shade with jute", "First harvest in 60-75 days; sieve and pack"] },
      { title: "Jeevamrit (200 L)", steps: ["10 kg fresh cow dung + 10 L cow urine", "2 kg jaggery + 2 kg gram flour (besan)", "1 handful forest/old-tree soil", "Mix in 200 L water, stir clockwise twice/day", "Ready in 5-7 days; use within 15 days"] },
      { title: "Neemastra (100 L)", steps: ["5 kg crushed neem leaves + 5 kg neem cake", "5 L cow urine + 2 kg cow dung", "Soak in 100 L water for 48 hours, stir twice/day", "Filter and spray undiluted on standing crop"] }
    ],
    hi: [
      { title: "वर्मीकम्पोस्ट बेड (10 फुट × 3 फुट)", steps: ["आधार पर 4 इंच सूखे पत्ते बिछाएँ", "6 इंच ताज़ा गोबर + फसल अवशेष (2-3 दिन पुराना) डालें", "2 किग्रा केंचुए छोड़ें", "40-50% नमी रखें, जूट से छाँव दें", "60-75 दिनों में पहली कटाई; छानकर पैक करें"] },
      { title: "जीवामृत (200 लीटर)", steps: ["10 किग्रा ताज़ा गोबर + 10 लीटर गोमूत्र", "2 किग्रा गुड़ + 2 किग्रा बेसन", "1 मुट्ठी जंगल / पुराने पेड़ की मिट्टी", "200 लीटर पानी में मिलाएँ, दिन में दो बार दक्षिणावर्त हिलाएँ", "5-7 दिन में तैयार; 15 दिन में उपयोग"] },
      { title: "नीमास्त्र (100 लीटर)", steps: ["5 किग्रा कुटी नीम पत्ती + 5 किग्रा नीम खली", "5 लीटर गोमूत्र + 2 किग्रा गोबर", "100 लीटर पानी में 48 घंटे भिगोएँ, दिन में 2 बार हिलाएँ", "छानकर बिना पतला किए छिड़काव"] }
    ]
  }
};
