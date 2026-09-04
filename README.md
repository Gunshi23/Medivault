# MediVault – Digital Medical Record Management System

MediVault is a full-stack web application designed for hospitals, clinics, and medical practices to securely manage digital patient profiles, medical history timelines, multi-medicine prescriptions, appointment schedules, and diagnostic document metadata.

> **6-Week Full Stack Web Development Internship Project** — Designed with a medical blue-and-white theme, role-based access control (RBAC), and persistent MongoDB storage.

---

## 🌟 Key Features

1. **Authentication & Authorization**:
   - JWT-based authentication with bcrypt password hashing.
   - Role-Based Access Control (`Admin` vs `Medical Staff`).
   - Sign In & Sign Up modal tabs.

2. **Patient Management & Profile**:
   - Comprehensive demographic profiles (Blood Group, Allergies, Existing Conditions, Emergency Contact).
   - Multi-field search (by Name, Phone) and filtering (by Gender, Blood Group).
   - Patient Profile view with detailed medical history timeline.

3. **Medical Records & Prescriptions**:
   - Consultation logging (Symptoms, Diagnosis, Test Results, Follow-up Dates).
   - Multi-medicine prescription manager (`Medicine Name`, `Dosage`, `Frequency`, `Duration`, `Instructions`).

4. **Appointment Management**:
   - Tabbed filtering (`Upcoming / Scheduled`, `Completed`, `Cancelled`).
   - Appointment date & time validation (prevents past scheduling).

5. **Medical Document Management**:
   - Metadata storage for diagnostic reports (Blood Tests, X-Rays, Scans, Prescriptions).
   - Filter documents by category or search by description.

6. **Dynamic Analytics Dashboard**:
   - Real-time MongoDB metrics (Total Patients, Medical Records, Appointments, Scheduled).
   - Dynamic **Appointments Overview** chart.

7. **User Profile & Security**:
   - Edit personal details & update passwords securely.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), React Router v7, Vanilla CSS, Axios
- **Backend**: Node.js, Express.js (MVC Pattern), REST APIs, JWT (`jsonwebtoken`), `bcryptjs`
- **Database**: MongoDB + Mongoose (with `mongodb-memory-server` zero-configuration fallback)

---

## 📁 System Architecture

```text
MediVault_Project/
├── backend/
│   ├── config/          # Database configuration (db.js)
│   ├── controllers/     # MVC Controllers (auth, patient, record, appointment, document, dashboard)
│   ├── middleware/      # Auth & Role-based Access Control (auth.js, roles.js)
│   ├── models/          # Mongoose Schemas (User, Patient, MedicalRecord, Appointment, Document)
│   ├── routes/          # Express Routers
│   ├── seed.js          # Internship demo data seeding script
│   └── server.js        # Server entry point
└── frontend/
    └── src/
        ├── components/  # Sidebar, Navbar, Modal, PrescriptionForm, ChartOverview
        ├── context/     # AuthContext.jsx
        ├── pages/       # DashboardPage, PatientsPage, PatientProfilePage, MedicalRecordsPage, AppointmentsPage, DocumentsPage, ProfilePage, LoginPage
        ├── api.js       # Centralized Axios service with JWT interceptor
        ├── App.jsx      # App routes & shell
        └── styles.css   # Blue & white medical theme stylesheet
```

---

## 🔐 Environment Variables

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medivault
JWT_SECRET=medivault_secret_key_12345
```

---

## 🚀 How to Run Locally

### 1. Backend Server
```bash
cd backend
npm install
npm run seed     # Populate internship demo data
npm run dev      # Runs on http://localhost:5000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5174
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Admin** | `admin@medivault.com` | `password123` | Full access (Create, Edit, Delete Patients/Records/Appointments/Documents) |
| **Medical Staff** | `staff@medivault.com` | `password123` | View profiles, Create/Edit records & appointments (Delete restricted) |
| **Custom Admin** | `gunshikaagarwaldpr@gmail.com` | `password123` | Full Admin access |

---

## 📡 REST API Endpoints Summary

### Auth & User Profile
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/profile` - Fetch current user profile
- `PUT /api/auth/profile` - Update name/phone
- `PUT /api/auth/change-password` - Change password securely

### Patients
- `GET /api/patients` - Query patients (supports `search`, `gender`, `bloodGroup`)
- `GET /api/patients/:id` - Get detailed patient profile with records & documents
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (Admin only)

### Medical Records
- `GET /api/records` - Query records (supports `diagnosis`, `doctor`, `date`)
- `GET /api/records/:id` - Get single record
- `POST /api/records` - Create record with prescriptions
- `DELETE /api/records/:id` - Delete record (Admin only)

### Appointments
- `GET /api/appointments` - Query appointments (supports `status`, `search`)
- `POST /api/appointments` - Schedule appointment (validated)
- `PATCH /api/appointments/:id/status` - Update status (`Scheduled`, `Completed`, `Cancelled`)
- `DELETE /api/appointments/:id` - Delete appointment (Admin only)

### Documents
- `GET /api/documents` - Fetch medical document metadata
- `POST /api/documents` - Upload document record
- `DELETE /api/documents/:id` - Delete document (Admin only)

### Dashboard Analytics
- `GET /api/dashboard/stats` - Dynamic Mongo stats & chart dataset
