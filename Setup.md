# 🚀 Genuin Platform API - Setup Guide

Welcome to the Genuin Platform API! This guide will walk you through the steps required to set up and run the application on your local machine or server.

## 📌 Prerequisites
Before proceeding, ensure that your system meets the following requirements:

- **Node.js (v16 or higher)** installed. [Download Node.js](https://nodejs.org/)
- **MySQL or PostgreSQL** database installed and running.
- **Redis or Memcached** for caching.
- A code editor like **VS Code** for editing files.

---

## 🛠 Step 1: Clone the Repository
Clone the project repository from GitHub using the following command:

```bash
git clone https://github.com/leatherdoctor/genuin_platform.git
cd genuin-platform
```

---

## ⚙️ Step 2: Configure Environment Variables
Rename the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Open the `.env` file and update the configuration variables as per your environment:

```env
# Application Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=genuin_platform
DB_DIALECT=mysql # or postgres

# JWT Secret Key
SECRET_KEY=your_jwt_secret_key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

🔹 **Note:** Replace `your_password`, `your_jwt_secret_key`, and other placeholders with actual values.

---

## 🛆 Step 3: Install Dependencies
Install all required dependencies by running the following command:

```bash
npm install
```

This will install all modules listed in the `package.json` file.

---

## 📂 Step 4: Set Up the Database
Run the `setupDatabase.js` script to create and initialize the database schema:

```bash
node scripts/setupDatabase.js  
```

This script will:
- Create the database if it doesn't exist.
- Apply all migrations to set up tables.

Seed the database with sample data by running the `seedData.js` script:

```bash
node scripts/seedData.js   
```

This script will populate the database with:
- 200 user records.
- 20 brand records.
- 50 community records.
- 100 group records.
- 400 group members.
- 100 video records.

---

## 🚀 Step 5: Start the Application
Once the database is set up and seeded, start the application using the following command:

```bash
node app.js
```

The application will start running on:

```
http://localhost:3000
```

You can access the API endpoints from this URL.

---

## 🌜 Step 6: Run Tests
To ensure everything is working correctly, you can run the test suite using:

```bash
npm test
```

This will execute all test cases to verify the functionality of different API endpoints.

---

## 🐝 Step 7: Access the API Documentation
To explore the API endpoints, navigate to the Swagger documentation:

```
http://localhost:3000/api-docs
```

---

## ⚡ Caching with Redis
If Redis is configured, the application will automatically cache frequently accessed data such as:

- Recent videos.
- Top videos by views.
- Top brands with the most video views.

You can observe Redis caching behavior directly in the terminal. For example:

```
PS D:\genuin_platform> node app.js
🚀 Server running on port 3000
✅ Redis connected successfully.
✅ Data fetched from database and cached: recent_videos:all
✅ Data retrieved from Redis cache: recent_videos:all
```

You can verify caching by checking the Redis instance or observing performance improvements in repeated queries.

---

## 🛠 Troubleshooting

**Database Connection Issues:**
- Ensure that your database credentials in the `.env` file are correct and that the database server is running.

**Missing Dependencies:**
- If you encounter errors related to missing modules, delete the `node_modules` folder and `package-lock.json` file, then run:
  
  ```bash
  npm install
  ```

**Port Conflicts:**
- If port 3000 is already in use, change the `PORT` variable in the `.env` file to another value (e.g., 4000).

---

🎉 **Congratulations! You have successfully set up the Genuin Platform API!** 🚀

