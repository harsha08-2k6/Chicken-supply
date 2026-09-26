# Chicken Supply Management System

A comprehensive web application designed to manage the supply chain of a chicken supply business. It provides dedicated interfaces and functionalities for Administrators, Restaurants, and Workers, streamlining the process from order placement to delivery.

## 🚀 Key Features

### Admin Dashboard
- **User Management:** View, add, edit, and manage accounts for Workers, Restaurants, and other Admins.
- **Order Management:** Track all orders across the system, view detailed order histories, and generate reports.
- **Inventory & Pricing:** Manage available chicken types and update pricing.

### Restaurant Dashboard
- **Place Orders:** Easily browse available chicken types and place new orders.
- **Order Tracking:** Monitor the real-time status of current orders.
- **Order History:** View past orders and manage order details.

### Worker Dashboard
- **Delivery Management:** View assigned orders for the day (Today's Orders) and upcoming days.
- **Status Updates:** Update the status of orders as they are processed and delivered.

## 🛠️ Technology Stack

- **Backend:** Java, Spring Boot, Spring Security, JPA/Hibernate
- **Frontend:** React, Vite, React Router, Context API for state management
- **Database:** Relational database (e.g., MySQL/PostgreSQL based on configuration)
- **Authentication:** JWT-based authentication with role-based access control (Admin, Restaurant, Worker)

## 📁 Project Structure

- `/backend`: Contains the complete Spring Boot application, including controllers, services, repositories, entities, and security configurations.
- `/frontend`: Contains the Vite + React frontend application with distinct views for each user role and shared UI components.

## ⚙️ Setup & Installation

### Backend
1. Navigate to the `backend` directory.
2. Ensure you have Java and Maven installed.
3. Configure your database settings in `backend/src/main/resources/application.properties`.
4. Run the application using Maven: `mvn spring-boot:run`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
