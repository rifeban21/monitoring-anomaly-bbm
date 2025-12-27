# 📊 Frontend Dashboard Monitoring Konsumsi

Frontend ini dibangun menggunakan React + Vite (JavaScript) dan Tailwind CSS versi terbaru, terintegrasi dengan backend FastAPI menggunakan JWT Authentication (Access Token & Refresh Token).

Aplikasi mendukung:
- Login Admin & Operator
- Dashboard Admin
- CRUD User, Lokasi, Produk
- Input Transaksi (Operator)
- Monitoring Anomali Konsumsi
- Auth Guard (Protected Route)

---

### 🧰 **Tech Stack**
- React (Vite – JavaScript)
- React Router DOM
- Axios
- Zustand (state management)
- Tailwind CSS (latest)
- JWT Authentication

---

### 📁 **Struktur Folder (Ringkas)**

```bash
src/
├── api/                # Axios & API request
├── components/
│   ├── layout/         # Sidebar, Topbar, DashboardLayout
│   └── routes/         # PrivateRoute
├── pages/
│   ├── auth/           # Login
│   ├── users/          # User Management (Admin)
│   ├── locations/
│   ├── products/
│   ├── transactions/  # Operator
│   └── anomaly/        # Monitoring Anomali
├── store/              # Zustand auth store
├── App.jsx
├── main.jsx
└── index.css
```

---

### ⚙️ **Prasyarat**
Pastikan sudah terinstall:
- Node.js ≥ 18
  Cek:

```bash
node -v
```

- Backend FastAPI sudah berjalan

```bash
http://127.0.0.1:8000
```

---

### 🚀 **Setup & Install Frontend**
1️⃣ Masuk ke folder frontend

```bash
cd frontend
```

2️⃣ Install dependencies

```bash
npm install
```

atau

```bash
yarn install
```

---

### 🎨 **Tailwind CSS (Latest)**

Project ini menggunakan Tailwind CSS versi terbaru
⚠️ TIDAK menggunakan **tailwind.config.js**

Tailwind sudah diaktifkan langsung melalui:

```css
/* src/index.css */
@import "tailwindcss";
```

Tidak perlu konfigurasi tambahan

---

### 🔐 **Konfigurasi Auth & API**
**Axios Global**
Semua request otomatis menambahkan token dari **localStorage**.

```js
Authorization: Bearer <access_token>
```

Token disimpan saat login:

```js
localStorage.setItem("token", access_token)
localStorage.setItem("user", JSON.stringify(user))
```

### 🛡️ **Protected Route (Auth Guard)**
Semua halaman dashboard dilindungi menggunakan **PrivateRoute**.

```jsx
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <DashboardHome />
    </PrivateRoute>
  }
/>
```

Jika token tidak ada → otomatis redirect ke **/login**.

---

### ▶️ **Menjalankan Aplikasi**

```bash
npm run dev
```

Akses di browser:

```arduino
http://localhost:5173
```

---

### 🔑 **Akun Default**
**Admin**
- Bisa mengelola User, Lokasi, Produk
- Bisa melihat Monitoring Anomali
**Operator**
- Input Transaksi
- Melihat Monitoring Anomali

⚠️ Akun admin dibuat dari backend (**create_admin.py**)

---

### 📊 **Fitur Utama**
✅ **Admin**
- Login
- Dashboard
- User Management (CRUD)
- Lokasi & Produk (CRUD)
- Monitoring Anomali
✅ **Operator**
- Login
- Input Transaksi
- Monitoring Anomali

---

### 🧪 **Debugging Umum**
❌ **Error 403 Forbidden**
- Token tidak terkirim
- Role user tidak sesuai endpoint
❌ **Error 422 Unprocessable Entity**
- Payload tidak sesuai schema backend
- Field kosong atau tipe data salah (string → number)
❌ **UI freeze / tidak bisa klik**
- Error API di console
- PrivateRoute atau token invalid

---

### 📌 **Catatan Penting**
- Pastikan backend sudah running
- Jangan buka dashboard tanpa login
- Selalu cek **Network & Console** di DevTools
- Pastikan role user sesuai (admin / operator)

---

### 📄 **Lisensi**
Project ini dibuat untuk tes kerja dan sebagai pembelajaran dan pengembangan internal.

---

