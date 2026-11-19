# Study-Mate 📚

Study-Mate is a MERN Stack-based task management application designed to help students organize their studies, manage tasks, and track their productivity.

## 🚀 Features

- User registration and login
- Secure authentication using JWT
- Create, edit, and delete tasks
- Manage and track study tasks
- Personalized dashboard
- Task statistics and progress tracking
- Protected routes for authenticated users

## 🛠️ Tech Stack

**Frontend**
- React.js
- CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 📁 Project Structure

```text
Study-Mate/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.js
│       ├── api.js
│       └── styles.css
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── app.js
│
└── package.json
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/codingpoorvansh007/Study-Mate.git
cd Study-Mate
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

## 🔐 Environment Variables

Configure your environment variables using the provided `.env.example` files.

Add your MongoDB connection string, JWT secret, and other required configuration values.

Never commit actual `.env` files or secret credentials to GitHub.

## ▶️ Run the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

## 🌐 Deployment

The application can be deployed using:

- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

## 👨‍💻 Author

**Study-Mate Project**

GitHub: https://github.com/codingpoorvansh007/Study-Mate

---

Made with ❤️ to make studying more organized and productive.