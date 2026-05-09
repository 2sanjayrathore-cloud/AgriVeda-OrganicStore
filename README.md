# 🌿 AgriVeda — Pure Organic Store

A complete, student-run organic-inputs store with admin dashboard, AI plant doctor, AI farming assistant, multilingual UI (English / हिंदी), WhatsApp & UPI automation, expense tracking, profit analysis, and CSV export.

> Built for the AgriVeda startup — selling Vermicompost, Jeevamrit, Neemastra, Brahmastra, Panchgavya, Beejamrit, BGA and more.

---

## 🚀 How to use

Just open **`index.html`** in any modern browser. Everything runs **client-side** — no backend, no server, no install.

### Public links (share these freely)

| Page | URL fragment | Who it's for |
| --- | --- | --- |
| 🏠 Home | `#/home` | Everyone |
| 🛍️ Shop | `#/shop` | Buyers |
| 🩺 AI Plant Doctor | `#/doctor` | Farmers |
| 💬 AI Farming Chat | `#/chat` | Farmers |

### Restricted links (don't share publicly)

| Page | URL fragment | Login |
| --- | --- | --- |
| 🎓 Student sales entry | `#/student` | Student code (issued by you) |
| 🔒 Admin dashboard | `#/admin` | Email/phone + password |

**Default admin password:** `7877612427` (change it from Admin → Settings).

---

## 🌍 Hosting on Google (free, permanent)

1. **GitHub Pages** (recommended)
   - Create a free account at <https://github.com>
   - Create a new repo → upload all files in this folder → enable Pages from Settings → Pages → "Deploy from main branch"
   - You will get a URL like `https://yourusername.github.io/agriveda/` — share it freely.

2. **Google Drive (quick test)**
   - Upload the folder → right-click `index.html` → "Open with → Live HTML viewer" extension.

3. **Firebase Hosting** (Google's own)
   - `npm install -g firebase-tools && firebase deploy`

The website is **fully self-contained** (only Google Fonts + React CDN are external) so it will run anywhere.

---

## 🔐 Security model

- **Admin** = identified by email `sanjayrathorevbyl@gmail.com` or phone `7877612427` + password.
- **Students** = approved by admin, log in with a code (`AVxxxx`) you issue from Admin → Students.
- All data is stored in the browser's `localStorage`. To move data between devices, use Admin → Settings → Export CSV.

---

## ✨ Features at a glance

- 14 organic-input products with live pricing, stock, descriptions and Hindi names
- Multilingual: full English/हिंदी toggle (one switch flips everything)
- **AI Plant Doctor** — describe symptoms or upload a photo → organic-input prescription
- **AI Farming Chat** — voice + text + suggested prompts
- **Student sales portal** — only approved students can record offline sales
- **Online checkout** — UPI QR + WhatsApp bill auto-send to buyer + auto-alert to admin
- **Auto order ID** generation: `AV‑YYYYMMDD‑####`
- **Admin dashboard** — KPIs, 14-day revenue chart, top products bar chart, student leaderboard
- **Expenses** — admin-only, instantly recalculates dashboard balance
- **Edit / delete** any sale, expense, student, or product
- **CSV export** of full workbook (sales + expenses)
- **Loyalty points** earned per buyer (configurable %)
- **Print-to-PDF invoice** built-in (Cmd/Ctrl+P)
- **Voice search** in AI chat (mic button)
- **Camera scan** for AI Doctor (live photo)

---

## 📞 Owner

- **Email:** sanjayrathorevbyl@gmail.com
- **Phone / WhatsApp:** 7877612427
- **Project:** AgriVeda Organic Store

May your soil stay alive 🌱
