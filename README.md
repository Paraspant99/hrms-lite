# HRMS Lite

##  Project Overview

HRMS Lite is a simple Human Resource Management System built to manage:

- Employees
- Attendance records

Users can:
- Add and delete employees
- Mark attendance (Present / Absent)
- View attendance records
- View attendance summary

The frontend is deployed on Vercel and connected to a live backend hosted on Railway.

---

##  Live Deployment

###  Live Frontend URL
https://hrms-lite1.vercel.app

###  Hosted Backend API
https://hrms-lite-production-befa.up.railway.app

Note: Visiting the backend URL directly in the browser may show:
`Cannot GET /`

This is normal because the backend only exposes API routes (e.g. `/api/employees`).

---

##  Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MySQL
- Railway (Deployment)

### Deployment
- Frontend: Vercel
- Backend + Database: Railway

---

##  How to Run the Project Locally

###  Clone the Repository

```bash
git clone https://github.com/Paraspant99/hrms-lite.git
cd hrms-lite

