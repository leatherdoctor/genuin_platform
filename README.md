# 🚀 Genuin Platform API

Welcome to the **Genuin Platform API**, a powerful backend solution enabling seamless interactions between **users, brands, communities, and videos**. This document outlines the project’s core functionalities, architecture, security implementations, and performance optimizations.

---

## 📌 Overview

The **Genuin Platform API** is built with **Node.js** and **Express.js**, leveraging a **MySQL/PostgreSQL** database for structured data storage and **Redis** for caching frequently accessed data. The API offers essential features such as **user authentication, role-based access control, content management**, and **performance enhancements** through caching and efficient database queries.

---

## 🎯 Key Features

### 🔑 Authentication & Security

- **JWT-Based Authentication**: Secure session management with **JSON Web Tokens (JWT)**.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to all CRUD operations.
  - **User**: Limited access, including video creation and group participation.
- **Secure Password Storage**: Passwords are encrypted using **bcrypt**, preventing plaintext storage.
- **Rate Limiting**: Protects against excessive API requests.
- **Input Validation**: Ensures only valid data enters the system, mitigating potential threats.
- **CORS Policy**: Configured to restrict unauthorized access to APIs.

### 🧐 Core Functionalities

#### 🤝 User Management

- **Secure Signup/Login**.
- **Join Communities & Groups**.
- **Upload Videos** (Users can only create videos but not interact with them).

#### 🏢 Brand & Community Management

- **Create, update, and manage brand details** (name, website, thumbnail, etc.).
- **Communities** belong to brands and facilitate structured user engagement.

#### 🎥 Video Management

- **Users can only create videos**.
- **Users can view video highlights but cannot engage with them (e.g., no likes, comments)**.
- **Videos are categorized under groups and have attributes like title, views, and timestamps**.

### ⚡ Performance Optimization (Caching)

- **Redis** is used to cache frequently accessed data, reducing database load and enhancing response speed.
- Cached data includes:
  - **Recent videos**
  - **Recent groups**
  - **Top videos by views**
  - **Top brands by engagement**
- **Example Terminal Output for Caching:**
  ```sh
  PS D:\genuin_platform> node app.js
  🚀 Server running on port 3000
  ✅ Redis connected successfully.
  ✅ Data fetched from database and cached: recent_videos:all
  ✅ Data retrieved from Redis cache: recent_videos:all
  ```

### 🌆 API Endpoints

| Endpoint                                 | Description                                     |
| ---------------------------------------- | ----------------------------------------------- |
| `/brands/videos/top`                     | Retrieves brands sorted by highest video views. |
| `/brands/videos/top?brand_id={brand_id}` | Fetches top videos for a specific brand.        |
| `/videos/recent?brand_id={brand_id}`     | Retrieves recent videos for a specific brand.   |
| `/videos/highlights?brand_id={brand_id}` | Fetches the most discussed videos for a brand.  |

---

## 🏰 Technical Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL/PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT
- **Password Security**: bcrypt
- **Middleware**: Express.js Middleware for security & validation
- **Testing Framework**: Jest

---

## 🧠 Implementation Details

### 📌 Database Relationships

- **Users** → Can create videos, join groups & communities.
- **Brands** → Own multiple communities.
- **Communities** → Belong to a brand and contain multiple groups.
- **Groups** → Belong to a community and house multiple videos.
- **Videos** → Created by users and associated with a group.

### ❌ Error Handling & Logging

- **Detailed error messages** for API failures.
- **Structured logging** for debugging and monitoring.
- **Graceful fallbacks** in case of service failures.

### 🔒 Security Enhancements

- **Token Expiry & Refresh Mechanism** for JWT sessions.
- **Restricted API Access** using role-based controls.
- **Data Sanitization** to prevent SQL injection and XSS attacks.

### 🏃 Performance Optimizations

- **Query Optimization**: Indexed database queries for high-speed data retrieval.
- **Efficient Pagination**: Limits excessive data retrieval in API responses.
- **Background Jobs**: Asynchronous processing for non-critical operations.

---

## 🚀 Test Coverage Report

The **test coverage is strong**, ensuring the reliability of core functionalities. Below is the latest report:

- **Overall Coverage:**
  - **Statements:** 87.4%
  - **Branches:** 88.13%
  - **Functions:** 77.77%
  - **Lines:** 89.27%

- **Successfully Passed Test Suites:** 3 out of 7.
- **Total Tests:** 68 (45 Passed, 23 Failed).
- **Uncovered Lines:** Few uncovered lines exist in `authController.js`, `configs.mock.js`, and `controller.mock.js`. Improvements are underway.
- **Ongoing Improvements:**
  - Identifying **open handles** using `--detectOpenHandles` to address any resource leaks.
  - Enhancing teardown mechanisms for better **worker process exits**.
  - Increasing branch and function coverage through additional test cases.

💡 **Despite minor gaps, the system has a solid foundation with a high percentage of working tests, ensuring confidence in core functionalities. Improvements are in progress to further enhance coverage.**

---

## 📚 Additional Documentation

- **API Documentation**: Available via **Swagger/OpenAPI**.
- **Database Schema**: Visual representation of database relationships.
- **Architecture Diagram**: Overview of system components and their interactions.

