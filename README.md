# 🌟 FavourFlow

FavourFlow is a web platform designed for students to exchange favours with each other.  
The idea is to make it easy for students in schools to create, assign, and redeem favours in a fair and transparent way.

---

## 🎯 Purpose
- Students can **create favours** (tasks, requests, or small help needed).
- A favour can either be:
  - **Assigned directly** to a specific student, or  
  - Left open for **any student to redeem**.
- Once a favour is redeemed, the **creator verifies** it to confirm completion.

This ensures a trusted cycle of giving and receiving favours among students.

---

## 🚀 Features
- Create favours with title, description, due date, and priority.
- Assign favours to specific students or keep them open for anyone to redeem.
- Redeem favours created by other students.
- Verification system: favour creators confirm when a favour is completed.
- Track favours you owe, favours owed to you, and completed favours.

---

## 🛠️ Tech Stack
### Frontend
- **Angular** (client UI)
- **TypeScript**
- **HTML5, CSS3**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Passport.js** with **JWT Authentication**
- **CORS enabled** for secure cross-origin requests

### Deployment
- **Render** (Backend + Frontend hosting)

---

## ⚡ Running the Project

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/favour-flow-app.git
   cd favour-flow-app

### 2. Configure the Backend
Create a `.env` file in the `backend/` folder to configure environment variables for the backend:

```bash
MONGO_URI=mongodb://localhost:27017/favourflow
JWT_SECRET=yourSuperSecretKey
PORT=3000
```

**Note**: Replace `yourSuperSecretKey` with a secure, unique key for JWT authentication.

### 3. Set Up the Frontend
Navigate to the `frontend/` folder, install dependencies, and build the Angular app:

```bash
cd frontend
npm install
npm run build
```

This will install the required frontend dependencies and generate a production-ready build of the Angular application.

### 4. Set Up the Backend
Navigate to the `backend/` folder and install backend dependencies:

```bash
cd ../backend
npm install
```

### 5. Start the Backend
From the `backend/` folder, start the Node.js server:

```bash
npm start
```

This will launch the backend server on the port specified in the `.env` file (default: `3000`).

### 6. Run the Application
Once the backend is running, open your browser and navigate to `http://localhost:3000` to access the Favour Flow app.

## Notes
- Ensure MongoDB is running locally or update the `MONGO_URI` in the `.env` file to point to your MongoDB instance.
- If you encounter issues, verify that all dependencies are installed and the `.env` file is correctly configured.
