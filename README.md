# 📅 Employee Leave Management System (LMS)

A robust **Full-Stack MERN** application designed to streamline company leave requests and approvals. This system provides a seamless workflow for employees to manage their time off and for managers to maintain team productivity.

## 🚀 Live Demo
[**View Live Project**](https://employee-leave-management-flax.vercel.app/)

---

## ✨ Key Features

### 👤 For Employees
* **Personal Dashboard:** Real-time visualization of remaining annual and sick leave balances.
* **Leave Request System:** Easy-to-use form to request leaves (Annual, Sick, Emergency, Unpaid).
* **Conflict Prevention:** Smart validation prevents overlapping leave requests.
* **History Tracking:** Detailed view of all past requests and their current status (Pending/Approved/Rejected).

### 👨‍💼 For Managers
* **Manager Insights:** Dashboard charts showing team availability (Who's In vs. Who's Out).
* **Team Calendar:** Visual calendar view to track all employee leaves at a glance.
* **Request Management:** One-click Approve/Reject with optional manager comments.
* **Auto-Deduction:** System automatically updates employee balances upon approval.

---

## ✨ Screenshots

### Login
<img width="1366" height="728" alt="login" src="https://github.com/user-attachments/assets/51718760-ce66-4c83-ba7e-c9c3ef914cb0" />

### Manager Dashboard
<img width="1366" height="728" alt="manager-dashbord" src="https://github.com/user-attachments/assets/95ef1c4e-8c62-4c35-b87e-51c9011a0934" />

### Add Employee
<img width="1366" height="728" alt="add-employee" src="https://github.com/user-attachments/assets/cc62c2a0-e087-4498-8d8e-a5cb5c695e2f" />

### Manager Analytics
<img width="1366" height="728" alt="manager-analytics-1" src="https://github.com/user-attachments/assets/3e302de2-a2b2-4fa4-b816-3a6227f392f1" />

### Manager Calendar
<img width="1366" height="728" alt="manager-calender" src="https://github.com/user-attachments/assets/0bf6224b-1ce2-4f03-9dac-516eaa405e94" />

### Employee Leave Request
<img width="1366" height="728" alt="request-leave" src="https://github.com/user-attachments/assets/bf609ad1-a6a1-457c-a0c6-5b5fea2c9d50" />

### Employee Dashboard
<img width="1366" height="728" alt="employee-dashbord" src="https://github.com/user-attachments/assets/419922d8-72aa-4d02-bba9-4628c4d9ba04" />

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide React (Icons).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (with Mongoose ODM).
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt for password hashing.
- **Visuals:** Recharts (for Analytics) & FullCalendar (for the Team Calendar).

---

## 🏗️ System Architecture & Logic

- **Role-Based Access Control (RBAC):** Secure routes and API endpoints for Managers and Employees.
- **Smart Validation:** - Employees cannot request more days than their available balance.
    - Double-booking prevention (cannot apply for leave during an existing leave period).
- **Automated Calculations:** Total leave days are calculated excluding weekends.

---

## 📂 Project Structure

├── client/          # React Frontend (Vercel)
├── server/          # Node.js Backend (Render)
└── README.md

```text
├── client/          # React Frontend (Vercel)
├── server/          # Node.js Backend (Render)
└── README.md
