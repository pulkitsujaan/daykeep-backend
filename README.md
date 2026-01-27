# 🛡️ DayKeep Journal - Backend

The robust Node.js API that powers the DayKeep Journal application. It handles authentication, data persistence, and secure communication with the database.

> **Note:** This is the Backend repository. The Frontend repository can be found [here](https://github.com/pulkitsujaan/daykeep-frontend)

---

## ✨ Features

* **🔐 Secure Authentication:** JWT (JSON Web Token) based auth with secure password hashing (Bcrypt).
* **📝 CRUD Operations:** Complete API endpoints for creating, reading, updating, and deleting journal entries.
* **💾 MongoDB Integration:** Flexible schema design using Mongoose for efficient data storage.
* **☁️ Image Storage:** Handles image uploads and storage (supports Cloudinary or local storage integration).
* **🛡️ Security Best Practices:** CORS configuration, Environment variable protection, and input validation.
* **📊 Analytics:** Endpoints to calculate user streaks and usage stats.

---

## 🛠️ Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
* **ODM:** [Mongoose](https://mongoosejs.com/)
* **Authentication:** [Passport.js](https://www.passportjs.org/) & JWT
* **Deployment:** [Render](https://render.com/)

---

## 🚀 Getting Started

Follow these steps to set up the server locally.

### 1. Prerequisites
Ensure you have **Node.js** and a **MongoDB Connection String** (local or Atlas).

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/daykeep-server.git
cd daykeep-server