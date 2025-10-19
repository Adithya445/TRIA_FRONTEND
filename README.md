# 🚀 Raftaar - A Real-Time Commenting System

Raftaar is a feature-rich, full-stack commenting system designed for real-time user interaction. Built with the MERN stack (MongoDB, Express, React, Node.js) and deployed on modern cloud infrastructure, it provides a seamless and secure experience for nested conversations.

**Live Demo:** [**Frontend on Vercel**](https://interiit-frontend-5v6a.vercel.app) | [**Backend on Render**](https://interiit-backend-5bmf.onrender.com)

---

## ✨ Features

This project is packed with features designed for a robust user experience and secure operation.

### 🔐 User Authentication
* **Secure Registration:** New users can sign up with domain-validated email addresses.
* **OTP Email Verification:** Accounts are secured with a one-time password (OTP) sent via **SendGrid**, preventing spam and ensuring valid users.
* **JWT-Based Sessions:** Authentication is handled using JSON Web Tokens (JWT) stored in secure, `httpOnly` cookies with `SameSite=None` and `Secure` attributes for cross-domain compatibility.
* **Admin Role:** A special admin role is supported, allowing for elevated privileges. To register as an admin, check the "Register as Admin" box on the registration form and use the password **`123456`**.

### 💬 Commenting System
* **Create, Read, Delete:** Authenticated users can post new comments and delete their own comments. Admins can delete any comment.
* **Upvote & Downvote:** Users can upvote or downvote comments to show their agreement or disagreement. The system correctly handles vote changes and removals.
* **Controlled Nested Replies ("Callback Hell" Style):** A sophisticated reply system that allows for deep conversations without sacrificing readability.
    * **Max Indentation:** Nesting is visually capped at **three levels** to prevent comments from becoming too narrow on screen (the "cornering" issue).
    * **Vertical Stacking:** After the third level, all subsequent replies maintain the same indentation, creating a clean, vertical thread.
    * **Contextual @mentions:** To maintain conversational context in deep threads, replies to nested comments are automatically formatted with an `@mention` of the user being replied to.
* **Dynamic Sorting:** Users can sort comments by **Newest**, **Oldest**, or **Most Upvoted** to find the most relevant conversations.

### 📱 Responsive UI
* **Mobile-First Design:** The UI is built with **Tailwind CSS** and is fully responsive, providing an optimal viewing experience on phones, tablets, and desktops.
* **Adaptive Layouts:** Media queries are used to adjust padding, margins, and text sizes, ensuring all components are usable and aesthetically pleasing on any screen size.

---

## 🛠️ Tech Stack

* **Frontend:**
    * **React** (with Vite)
    * **React Router** for client-side routing
    * **Tailwind CSS** for responsive styling
    * **Axios** for API communication
    * **React Context API** for global state management
* **Backend:**
    * **Node.js** & **Express** for the server
    * **MongoDB** (with Mongoose) as the database
    * **JWT (jsonwebtoken)** for authentication
    * **bcrypt.js** for password and OTP hashing
* **Services & Deployment:**
    * **SendGrid** for transactional email (OTP)
    * **Vercel** for frontend deployment
    * **Render** for backend deployment
    * **Docker** for containerization

---

## 🐳 Dockerization

This project is fully containerized using Docker, allowing you to run the entire application with a single command without needing to install Node.js or MongoDB on your local machine.

### Prerequisites
* Docker and Docker Compose installed.

### Running with Docker Compose
1.  In the root directory (`INTER--IIT`), create a `.env` file for the backend and add all the required environment variables (see Backend Setup below).
2.  Run the following command from the root directory:
    ```bash
    docker-compose up --build
    ```
This will build the images for both the frontend and backend services and start the containers. The frontend will be available at `http://localhost:5173`.

---

## ⚙️ Local Setup and Installation (Without Docker)

To run this project on your local machine without Docker, follow these steps:

### Prerequisites
* Node.js and npm/pnpm installed
* A MongoDB Atlas account and connection string
* A SendGrid account with an API key and a verified sender email

### Backend Setup

1.  Clone the repository and navigate to the `backend` directory.
2.  Create a `.env` file and add the following variables:
    ```env
    PORT=5000
    MONGO_URL=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_JWT_Secret>
    SENDGRID_API_KEY=<Your_SendGrid_API_Key>
    SENDGRID_SENDER_EMAIL=<Your_SendGrid_Verified_Email>
    ALLOWED_DOMAINS=your,allowed,email,domains
    ALLOWED_ORIGINS=http://localhost:5173
    ```
3.  Install dependencies and start the server:
    ```bash
    npm install
    npm start
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Create a `.env.local` file and add the backend URL:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```
3.  Install dependencies and start the development server:
    ```bash
    pnpm install
    pnpm dev
    ```
The frontend will be available at `http://localhost:5173`.