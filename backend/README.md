## 🚀 **Backend – BBM Consumption Monitoring & Anomaly Detection API**

Backend service untuk aplikasi Monitoring Konsumsi BBM & Deteksi Anomali, dibangun dengan FastAPI (async), PostgreSQL, JWT Authentication, dan Role-Based Access Control (Admin & Operator).

---


### 🧱 **Tech Stack**
- Python 3.10+
- FastAPI (Asynchronous)
- SQLAlchemy Async
- PostgreSQL
- Alembic (Database Migration)
- JWT Authentication
- Passlib (bcrypt) – Password Hashing

---

### 📂 **Struktur Backend (Ringkas)**

```bash
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   ├── core/
│   ├── crud/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── main.py
├── alembic/
├── alembic.ini
├── requirements.txt
├── .env
└── README.md
```

### 1️⃣ **Prerequisite**
Pastikan sudah terinstall:
- Python 3.10 atau lebih baru
- PostgreSQL
- Git
Cek versi Python:

```bash
python --version
```

---

### 2️⃣ **Clone Repository**

```bash
git clone <repository-url>
cd backend
```

---

### 3️⃣ **Membuat & Mengaktifkan Virtual Environment**
▶ **Windows (PowerShell / CMD)**

```bash
python -m venv .venv
.venv\Scripts\activate
```

▶ **macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Jika berhasil, prompt akan berubah:

```scss
(.venv)
```

---

### 4️⃣ **Install Dependencies**

```bash
pip install fastapi uvicorn pydantic-settings python-dotenv asyncpg sqlalchemy passlib[bcrypt] python-jose[cryptography] alembic
```


```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Pastikan tidak ada error saat instalasi.

---

### 5️⃣ **Konfigurasi Environment (.env)**
Buat file .env di folder backend/:

```env
APP_NAME=BBM Monitoring API
ENV=development

DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/monitoring_bbm

SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

📌 **Catatan**
- Sesuaikan username, password, dan database
- Database harus sudah dibuat di PostgreSQL

---

###6️⃣ **Migrasi Database (Alembic)**
▶ **Generate Migration (jika belum ada)**

```bash
alembic revision --autogenerate -m "init tables"
```

▶ **Jalankan Migration**

```bash
alembic upgrade head
```

Jika berhasil, tabel berikut akan dibuat:
- users
- locations
- products
- transactions
- baseline_state (jika ada)

---

###7️⃣ **Menambahkan User Admin Awal**
**Backend menyediakan script untuk membuat akun admin awal.**

📄 Lokasi file:

```bash
app/services/create_admin.py
```

▶ **Jalankan Script**

```bash
python -m app.services.create_admin
```

📌 Default admin (contoh):
- **username: admin**
- **password: admin123**
- **role: admin**
⚠️ **Disarankan ganti password setelah login pertama**

---

###8️⃣ **Menjalankan Backend Server**

```bash
uvicorn app.main:app --reload
```

Jika berhasil:

```nginx
Uvicorn running on http://127.0.0.1:8000
```

---

###9️⃣ **Akses API Documentation (Swagger)**
Buka browser:

```arduino
http://127.0.0.1:8000/docs
```

Swagger UI menyediakan:
- Login
- Authorize JWT
- CRUD Master Data
- CRUD Transaksi
- Monitoring Anomali

---

###🔐 **Cara Login & Authorize JWT di Swagger**
**Klik tombol Authorize 🔒**

Isi:
- **username**
- **password**

---

###👥 **Role & Hak Akses**
| Role      | Akses                        |
| --------- | ---------------------------- |
| Admin     | CRUD user, master data       |
| Operator  | Input transaksi konsumsi     |
| All login | Lihat transaksi & monitoring |

---

###📄 **License**
MIT License

---

