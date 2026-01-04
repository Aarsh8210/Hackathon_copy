# Dayflow – HR Management System

**Dayflow** is a role-based Human Resource Management System built for the **Odoo × GCET Hackathon (Round 1)**.  
It streamlines core HR operations such as authentication, attendance, leave management, and profile handling.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- Email + Password login
- Mandatory role selection (Employee / Admin)
- Role-based access enforcement

### 👨‍💼 Employee
- Dashboard with card-based UI
- View & edit limited profile details
- Attendance:
  - Check-In / Check-Out
- Leave management:
  - Apply leave
  - Track status (Pending / Approved / Rejected)

### 🧑‍💼 Admin / HR
- Dashboard with interactive navigation
- Approve / Reject employee leave requests
- View attendance of all employees
- Full access to edit:
  - Own admin profile
  - Employee profiles

---

## 🧱 Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask)
- **APIs:** REST (JSON)
- **Storage:** In-memory (hackathon MVP)

---

## ▶️ How to Run
```bash
python backend/app.py
```
Open frontend/login.html in browser.
---
## 🔑 Demo Credentials
### Employee
Email: emp@dayflow.com
Password: 1234
Role: Employee

### Admin / HR
Email: admin@dayflow.com
Password: 1234
Role: Admin / HR

## 🔮 Future Scope
Database integration
Email verification & password hashing
Payroll management
Attendance analytics

## 👥 Team
Aarsh Shah – Team Lead & Backend
Shubham Shah – Frontend
Vraj Tejwani – UI & Integration
