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
