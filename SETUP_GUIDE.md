# FYP-F25 — Complete Setup Guide
## Yeh sab steps order mein karo

---

## STEP 1: Dependencies Install Karo

### Client (React App) ke liye:
```bash
cd client
npm install
npm install react-router-dom firebase lucide-react recharts
```

### Server (Node.js) ke liye:
```bash
cd server
npm init -y
npm install express cors dotenv firebase-admin
```

---

## STEP 2: .env Files Banao

### client/.env  (React app ke liye)
```
VITE_FIREBASE_API_KEY=yahan_apni_key_likho
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourproject-id
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:xxxx:web:xxxx
VITE_API_BASE_URL=http://localhost:5000
```

### server/.env  (Backend ke liye)
```
PORT=5000
CLIENT_URL=http://localhost:5173
FIREBASE_PROJECT_ID=yourproject-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@yourproject.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR KEY HERE\n-----END PRIVATE KEY-----\n"
```

### Firebase Admin Keys Kahan Se Milengi:
1. Firebase Console kholo
2. Project Settings > Service Accounts
3. "Generate new private key" pe click karo
4. JSON file download hogi — us se values copy karo

---

## STEP 3: Files Apne Project Mein Rakho

```
client/src/
  services/firebase.js          ← firebase.js
  context/AuthContext.jsx       ← AuthContext.jsx
  routes/ProtectedRoute.jsx     ← ProtectedRoute.jsx
  routes/AdminRoute.jsx         ← AdminRoute.jsx
  App.jsx                       ← App.jsx
  pages/auth/LoginPage.jsx      ← LoginPage.jsx
  pages/auth/RegisterPage.jsx   ← RegisterPage.jsx
  pages/player/PlayerDashboard.jsx ← PlayerDashboard.jsx
  pages/admin/AdminDashboard.jsx   ← AdminDashboard.jsx

server/
  index.js                      ← index.js
  services/firebaseAdmin.js     ← firebaseAdmin.js
  middleware/authMiddleware.js  ← authMiddleware.js
  routes/userRoutes.js          ← userRoutes.js
  routes/adminRoutes.js         ← adminRoutes.js
```

---

## STEP 4: Tailwind CSS Setup Karo (agar pehle se nahi hai)

```bash
cd client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js mein yeh likho:**
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css mein yeh 3 lines add karo:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## STEP 5: Servers Chalao

### Client (Terminal 1):
```bash
cd client
npm run dev
```
App chalegi: http://localhost:5173

### Server (Terminal 2):
```bash
cd server
node index.js
```
API chalegi: http://localhost:5000

---

## STEP 6: Test Karo

1. http://localhost:5173/register pe jao
2. Naya account banao
3. Firestore Console mein check karo — user document ban gaya?
4. Logout karo
5. Login karo — /dashboard pe aana chahiye
6. Admin role set karo (Firestore mein manually)
7. Admin email se login karo — /admin pe aana chahiye

---

## Common Errors aur Solutions

| Error | Solution |
|-------|----------|
| "Module not found: firebase" | `npm install firebase` client folder mein |
| "Module not found: recharts" | `npm install recharts` client folder mein |
| "Cannot read env variables" | .env file client/ folder ki root mein hai? |
| Admin page nahi khul raha | Firestore mein role: "admin" set kiya? |
| CORS error console mein | server/.env mein CLIENT_URL sahi hai? |

