# HRMS Lite – Human Resource Management System

HRMS Lite is a lightweight, production-ready Human Resource Management System designed for internal use by a single admin user.  
It enables efficient employee record management and daily attendance tracking through a clean REST API and a modern web interface.

This project was built as a full-stack interview assignment with a focus on correctness, stability, clean architecture, and realistic usability.

---

## 📌 Project Overview

HRMS Lite provides the following core capabilities:

- Employee management (add, view, delete employees)
- Daily attendance tracking (Present / Absent)
- Attendance history per employee
- RESTful backend with MongoDB persistence
- Professional, responsive frontend UI

The system intentionally avoids authentication and role management to keep the scope focused and aligned with internal HR tooling requirements.

---

## 🛠 Tech Stack

### Backend
- **Python 3.x**
- **Django**
- **Django REST Framework (DRF)**
- **MongoDB**
- **MongoEngine** (MongoDB ODM)
- **Gunicorn** (production WSGI server)

### Frontend
- **React**
- **Vite**
- **JavaScript (ES6+)**
- **Tailwind CSS**
- **Axios**

### Deployment
- **Backend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 🚀 Local Setup Instructions

### Prerequisites
Ensure the following are installed on your system:
- Python 3.10+
- Node.js 18+
- MongoDB (local) or MongoDB Atlas
- Git

---

### 🔹 Backend Setup (Django)

1. Navigate to the backend directory:
```bash
cd backend
