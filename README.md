# ⛽ **Sistem Monitoring & Deteksi Anomali Konsumsi BBM**
Aplikasi ini adalah sistem monitoring konsumsi BBM yang dilengkapi deteksi anomali otomatis berdasarkan pola historis konsumsi.

Sistem dirancang dengan arsitektur Backend (FastAPI) + Frontend (React) dan mendukung multi-role user:
- **Admin** → Master data & monitoring
- **Operator** → Input transaksi konsumsi

---

### 🎯 **Tujuan Aplikasi**
1. Mencatat transaksi konsumsi BBM harian
2. Mengontrol penggunaan BBM per lokasi & produk
3. Mendeteksi konsumsi tidak wajar (anomali)
4. Memberikan peringatan dini sebelum terjadi penyimpangan besar

---

### 🧠 **Konsep Deteksi Anomali**
📌 **Masalah yang Diselesaikan**
Konsumsi BBM tidak selalu konsisten. Bisa terjadi:
- Pemborosan
- Kebocoran
- Penyalahgunaan
- Kesalahan pencatatan
- Sistem ini tidak hanya mencatat, tapi menganalisis.

---

### 🔍 **Alur Deteksi Anomali Konsumsi BBM**
1️⃣ **Operator Input Transaksi**
Operator mencatat:
- Tanggal
- Lokasi
- Produk BBM
- Volume konsumsi

📌 Contoh:

```yaml
Tanggal  : 2025-01-10
Lokasi   : Gudang A
Produk   : Solar
Volume   : 520 liter
```

---

2️⃣ **Sistem Hitung Baseline (Pola Normal)**
Backend otomatis menghitung **baseline konsumsi normal** berdasarkan data historis:
- Rata-rata konsumsi sebelumnya
- Pola konsumsi lokasi & produk yang sama

📌 Contoh:

```scss
Baseline normal: 300 liter
```

---

3️⃣ **Hitung Risk Score**
Sistem menghitung tingkat risiko:

```ini
risk_score = (volume aktual / baseline) × 100
```

📌 Contoh:

```
520 / 300 × 100 = 173
```

---

4️⃣ **Tentukan Status Anomali**
| Risk Score | Status  |
| ---------- | ------- |
| < 120      | NORMAL  |
| 120–150    | WASPADA |
| > 150      | ANOMALI |

📌 Hasil:

```yaml
Risk Score: 173
Status: ANOMALI
```

---

5️⃣ **Simpan & Tampilkan di Dashboard**
Hasil analisis disimpan di tabel **Anomaly Monitoring** dan ditampilkan ke:
- Admin
- Operator (read-only)
Lengkap dengan:
- Lokasi
- Produk
- Volume
- Baseline
- Risk Score
- Alasan anomali

---

### 🧱 **Arsitektur Sistem**

```pgsql
┌───────────────┐
│   Frontend    │  React + Vite + Tailwind
│ (Admin / Ops) │
└───────▲───────┘
        │ JWT
┌───────┴───────┐
│   Backend     │  FastAPI (Async)
│ Auth + API    │
└───────▲───────┘
        │
┌───────┴───────┐
│   Database    │  PostgreSQL
│ Users, Trx,   │
│ Anomalies     │
└───────────────┘
```

---

### 🔐 **Role & Hak Akses**
👑 **Admin**
- Login
- Kelola User (Admin & Operator)
- Kelola Lokasi & Produk
- Monitoring Anomali
- Melihat seluruh transaksi
👷 **Operator**
- Login
- Input Transaksi
- Melihat Monitoring Anomali

---

### ✅ **Keunggulan Sistem**
- Async & scalable
- Role-based access
- Deteksi otomatis
- Monitoring real-time
- Siap dikembangkan lebih ke ML / AI

---

### 📌 **Catatan Pengembangan Lanjutan**
- Grafik tren konsumsi
- Threshold dinamis per lokasi
- Export laporan (PDF / Excel)
- Notifikasi anomali (Email / WhatsApp)
- Machine Learning model

---

### 🏁 **Penutup**
Aplikasi ini cocok untuk:
- Monitoring BBM
- Audit operasional
- Sistem kontrol internal
- Portfolio backend & frontend profesional

---
