-----

# WFH Employee Attendance Application

Hello\! This is my submission for the Fullstack Web Technical Test from Dexa Group. This project is a comprehensive, full-stack web application designed to manage Work-From-Home (WFH) employee attendance.

[cite\_start]The application is built based on the provided use case [cite: 25][cite\_start], featuring a backend with a **microservices architecture** using **NestJS** [cite: 5, 18] [cite\_start]and a dynamic, responsive frontend using **React.js**[cite: 10]. [cite\_start]The goal was to create two primary interfaces: one for employees to log in and record their attendance [cite: 27][cite\_start], and another for HR administrators to manage employee data and monitor attendance records[cite: 29].

-----

## ✨ Core Features

The application is split into two main roles, each with its own set of functionalities:

### For Employees

  * [cite\_start]**Secure Authentication**: Employees can log in to access their dashboard[cite: 27].
  * [cite\_start]**Clock-in & Clock-out**: Capture attendance with the exact date, time, and location coordinates[cite: 27].
  * [cite\_start]**Photo Proof**: Upload a photo during clock-in as evidence of working from home[cite: 27].
  * **Attendance History**: View personal attendance logs.

### For HR Admins

  * [cite\_start]**Employee Management**: A web-based interface to add new employees or update existing employee data[cite: 29].
  * [cite\_start]**Attendance Monitoring**: View a comprehensive list of attendance records submitted by all employees[cite: 29].
  * **Role-Based Access**: Secure endpoints ensure that only authorized HR personnel can manage employee data.

-----

## 🛠️ Tech Stack & Architecture

This project is built as a monorepo to streamline development and deployment.

### Backend (`wfh-attendance-app`)

[cite\_start]The backend follows a microservice pattern to ensure scalability and separation of concerns[cite: 18].

  * [cite\_start]**Framework**: **NestJS** [cite: 5]
  * [cite\_start]**Language**: **TypeScript** [cite: 4]
  * **`api-gateway`**: A single entry point that receives all client requests and routes them to the appropriate internal service.
  * **`auth-service`**: Handles user authentication, role validation, and JWT generation.
  * **`users-service`**: Manages all CRUD operations for employee data.
  * **`attendance-service`**: Manages all attendance-related logic, including clock-ins, clock-outs, and file uploads.
  * [cite\_start]**Database**: **MySQL** with migrations handled by `db-migrate`[cite: 6].
  * **Object Storage**: **Minio** for storing uploaded attendance photos.
  * **Communication**: Services communicate over **TCP** for efficient, low-latency internal requests.

### Frontend (`employee-frontend`)

A modern, single-page application (SPA) providing a seamless user experience.

  * [cite\_start]**Framework**: **React.js** (with Vite) [cite: 10]
  * **Language**: **TypeScript**
  * **Styling**: **Tailwind CSS** for a utility-first design approach.
  * **Routing**: `react-router-dom` for handling client-side navigation.
  * **State Management**: Component state and context for managing UI and data.

-----
