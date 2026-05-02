# 🎓 Smart Campus Management System

A full-stack Smart Campus system designed to manage university resources efficiently.  
This system includes resource booking, ticket management, notifications, and secure role-based access.

---

## 🚀 Features

### 🔐 Authentication & Security
- Google OAuth2 login
- JWT-based authentication
- Role-based access control (USER, ADMIN, TECHNICIAN)
- Secured API endpoints

### 📅 Resource Booking
- Book campus resources (rooms, labs, etc.)
- Prevent double bookings (conflict detection)
- Time slot selection with unavailable slots disabled
- Capacity validation
- Resource availability filtering

### 🎫 Ticket Management
- Raise and manage support tickets
- Role-based ticket handling

### 📧 Email Notifications
- Booking confirmation emails
- Approval / rejection notifications
- Asynchronous email sending using `@Async`

### 📊 Admin Dashboard
- View system analytics
- Manage users and resources
- Monitor bookings and activities

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Custom CSS (modern UI design)
- React Router
- Axios

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs

### Database
- MySQL

### Other Tools
- JavaMailSender (Email service)
- Google OAuth2
- Maven

---

## 🧠 Key Concepts Implemented

- DTO pattern for clean data transfer
- Layered architecture (Controller → Service → Repository)
- Async processing (`@Async`) for email handling
- Validation (frontend + backend)
- Secure authentication using JWT
- Conflict detection in bookings

---
