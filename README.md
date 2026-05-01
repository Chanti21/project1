# Team Task Manager

## 📖 Project Overview
Team Task Manager (TaskFlow) is a complete, production-ready full-stack MERN web application designed for efficient team collaboration and project tracking. It provides a robust authentication system, role-based access control (Admin vs. Member), and a sleek, modern UI built with React and Tailwind CSS. The platform allows teams to manage projects, assign tasks, track progress, and monitor productivity through an interactive dashboard.

## ✨ Features
### 1. Authentication & Security
- Secure Signup and Login
- JSON Web Token (JWT) based authentication
- Persistent login sessions
- Password hashing using bcryptjs
- Protected and role-gated routes

### 2. Role-Based Access Control (RBAC)
**Admin:**
- Full control over Project CRUD (Create, Read, Update, Delete)
- Add or remove team members from projects
- Task CRUD capabilities
- Assign tasks to specific members
- Change task statuses

**Member:**
- Access to a personalized dashboard
- View assigned tasks and associated projects
- Update the status of their own tasks (Todo -> In Progress -> Completed)

### 3. Project Management
- Organize workflows by creating distinct projects
- View comprehensive project lists
- Seamlessly invite team members to collaborate on projects

### 4. Task Management
- Detailed task creation with descriptions and due dates
- Intelligent overdue task detection
- Status tracking (Todo, In Progress, Completed)

### 5. Interactive Dashboard
- Visual statistics overview
- Total tasks, Completed tasks, Pending tasks, and Overdue tasks metrics
- Project and assignment statistics

### 6. Modern UI/UX
- Fully responsive, mobile-friendly design
- Clean sidebar navigation
- Dashboard statistic cards
- Informative tables and smooth modals
- Real-time toast notifications for user actions
- Elegant dark theme utilizing Tailwind CSS

## 🛠️ Tech Stack
**Frontend:**
- React.js + Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React (Icons)
- React Toastify

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- cors

## 📂 Folder Structure
```text
root/
 ├── client/               # React Frontend (Vite)
 │   ├── src/
 │   │   ├── components/   # Reusable UI elements (Button, Input, Modal, Sidebar)
 │   │   ├── context/      # React Context (AuthContext)
 │   │   ├── pages/        # Main pages (Dashboard, Projects, Tasks, Login)
 │   │   ├── routes/       # Protected routing wrappers
 │   │   └── services/     # Axios API service handlers
 ├── server/               # Express Backend
 │   ├── config/           # Database configuration
 │   ├── controllers/      # Route logic (auth, projects, tasks, users)
 │   ├── middleware/       # Auth, role-checking, error handling
 │   ├── models/           # Mongoose schemas
 │   └── routes/           # API endpoints
 ├── README.md             # Project documentation
 ├── github_setup.ps1      # GitHub automation script (Windows)
 ├── github_setup.sh       # GitHub automation script (Mac/Linux)
 ├── package.json          # Monorepo root configuration
 └── .env.example          # Environment variable templates
```

## ⚙️ Installation Steps
1. **Clone the repository** (or download the source code):
   ```bash
   git clone <repository-url>
   cd team-task-manager
   ```
2. **Install all dependencies** (This single command installs root, server, and client packages):
   ```bash
   npm run install-all
   ```

## 🔐 Environment Setup
You must configure your environment variables before running the application.

1. **Backend Environment**
   Navigate to the `server/` folder and copy `.env.example` to `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```

2. **Frontend Environment**
   Navigate to the `client/` folder and copy `.env.example` to `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## 📡 API Routes
**Auth:**
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current logged-in user profile

**Projects:**
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/:id/members` - Add member to project (Admin)
- `DELETE /api/projects/:id/members/:userId` - Remove member (Admin)

**Tasks:**
- `GET /api/tasks` - Get tasks (Filtered by role/assignment)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task (Admin can update all, Member can update status)
- `DELETE /api/tasks/:id` - Delete task (Admin)
- `GET /api/tasks/stats` - Get dashboard metrics

**Users:**
- `GET /api/users` - Get all users (Admin)

## ☁️ Deployment Guide

### MongoDB Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Under "Database Access", create a new database user with a password.
3. Under "Network Access", allow access from anywhere (`0.0.0.0/0`).
4. Click "Connect" -> "Connect your application" and copy the connection string. Replace `<username>` and `<password>` with your database user credentials. Use this string for your `MONGO_URI`.

### GitHub Setup
You can use the provided automation scripts to push your code to GitHub instantly:
- **Windows (PowerShell):** `./github_setup.ps1`
- **Mac/Linux (Bash):** `bash github_setup.sh`

The script will initialize git, add all files, commit the code, ask for your blank GitHub repo URL, and push the codebase automatically.

### Railway Setup
This application is configured as a monorepo, meaning Railway will handle both the backend and frontend simultaneously.

1. Create an account on [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your newly pushed `team-task-manager` repository.
4. Go to the project **Variables** tab and add:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`
5. Railway will automatically detect the root `package.json`, install dependencies, build the React client (`npm run build`), and start the Node.js server (`npm start`). The Express server is already configured to serve the static built React files in production.
6. Generate a public domain in Railway's networking settings.

## 🛠️ Troubleshooting
- **"Cannot connect to database"**: Ensure your MongoDB Atlas IP access list is set to allow requests from anywhere (`0.0.0.0/0`) if deploying, or your local IP if running locally. Ensure the password in the URI does not contain unescaped special characters.
- **"Not authorized, token failed"**: Your JWT token may have expired. Log out and log back in.
- **"npm run install-all fails"**: Ensure you have a recent version of Node.js installed (v16+). If on Windows, ensure your execution policies allow running scripts.
- **Tailwind CSS styles not loading**: Ensure the `client/src/index.css` is imported in your `main.jsx` and the development server is running correctly.

## 📸 Screenshots
*(Add your application screenshots here)*
- `[Screenshot 1: Dashboard View]`
- `[Screenshot 2: Task Management Modal]`
- `[Screenshot 3: Project Members Management]`

## 🎥 Demo Video
Watch the full application walkthrough here:
*(Insert YouTube / Loom link here)*

### Demo Script Reference (2-5 Minutes)
1. **(0:00 - 0:30) Intro & Auth:** Show the signup process, explaining the Admin vs. Member role selection. Log in as a newly created Admin.
2. **(0:30 - 1:15) Projects:** Navigate to the Projects page. Create a new project called "Website Launch". Add registered team members to this project.
3. **(1:15 - 2:30) Tasks:** Go to Tasks. Create a new task, assign it to a team member, set a due date, and select a project. Show the filtering capabilities.
4. **(2:30 - 3:30) Member View:** Log out and log back in as the assigned Member. Show that the Member only sees their assigned tasks. Update the task status to "In Progress" and then "Completed".
5. **(3:30 - 4:15) Dashboard:** Return to the Admin view. Show the Dashboard reflecting the updated task statistics and recent activity.
6. **(4:15 - 5:00) Responsiveness:** Shrink the browser window to mobile size, demonstrating the responsive sidebar drawer and stacked card layouts. Conclude the demo.

## 🔗 Live URL
*(Add your deployed Railway URL here)*
- **Live Application:** `https://your-app-url.up.railway.app`

## 🐙 GitHub Repo
*(Add your GitHub Repo URL here)*
- **Repository:** `https://github.com/yourusername/team-task-manager`
