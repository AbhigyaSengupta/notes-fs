# 📝 Notes App

A full-stack notes application built with React + Redux Toolkit on the frontend and Express + MongoDB on the backend.

---

## 🚀 Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React + Vite | UI Framework |
| React Router DOM | Routing + Protected/Public routes |
| Redux Toolkit | State Management + AsyncThunk |
| React Redux | Redux Hooks |
| Redux Persist | Persist auth across reloads |
| React Hook Form | Forms + validation |
| Axios | HTTP requests via Vite proxy |
| React Hot Toast | Notifications |
| Heroicons | Icons |
| Tailwind CSS | Styling |

### Backend
| Package | Purpose |
|---|---|
| Express | Server |
| MongoDB + Mongoose | Database |
| bcrypt | Password hashing |
| jsonwebtoken | JWT auth |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| Yup | Request body validation |

---

## 📁 File Structure

notes-app/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── dbConfig.js
│ │ ├── controller/
│ │ │ ├── userController.js
│ │ │ └── noteController.js
│ │ ├── middleware/
│ │ │ └── hasToken.js
│ │ ├── models/
│ │ │ ├── userSchema.js
│ │ │ ├── noteSchema.js
│ │ │ └── sessionSchema.js
│ │ ├── routes/
│ │ │ ├── userRoutes.js
│ │ │ └── noteroute.js
│ │ └── validators/
│ │ ├── userValidate.js
│ │ └── noteValidate.js
│ ├── .env
│ └── server.js
│
└── frontend/
├── src/
│ ├── app/
│ │ └── store.js # Redux store + persist config
│ ├── features/
│ │ ├── auth/
│ │ │ └── authSlice.js # loginUser, registerUser, logoutUser thunks
│ │ └── notes/
│ │ └── notesSlice.js # fetchNotes, createNote, updateNote, deleteNote thunks
│ ├── hooks/
│ │ └── useLogout.js # Logout: backend + clearAuth + clearNotes + redirect
│ ├── components/
│ │ ├── Navbar.jsx # Nav + avatar badge + username + logout
│ │ ├── NoteCard.jsx # Note card + edit/delete buttons
│ │ ├── NoteModal.jsx # Create/Edit note modal
│ │ ├── DeleteModal.jsx # Delete confirmation modal
│ │ └── Protected.jsx # Route guard for authenticated routes
│ ├── pages/
│ │ ├── Login.jsx # Login form + eye toggle + Redux error
│ │ ├── Register.jsx # Register form + Yup validation errors
│ │ └── NotesPage.jsx # Notes grid + create button
│ ├── App.jsx # Routes + PublicRoute + Protected
│ ├── main.jsx # ReactDOM + Provider + PersistGate
│ └── index.css # Tailwind imports
├── index.html
├── tailwind.config.js
└── vite.config.js # appType: spa + proxy to backend:8001

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/notes-app.git
cd notes-app

cd backend
npm install

cd frontend
npm install

PORT=8001
URL=your_mongodb_connection_string
secretKey=your_jwt_secret_key

# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev

http://localhost:5173

Auth Routes (/user)

| Method | Route          | Description               | Auth |
| ------ | -------------- | ------------------------- | ---- |
| POST   | /user/register | Register new user         | ❌    |
| POST   | /user/login    | Login → returns JWT token | ❌    |
| DELETE | /user/logout   | Logout + delete session   | ✅    |

Notes Routes (/note)

| Method | Route            | Description                  | Auth |
| ------ | ---------------- | ---------------------------- | ---- |
| GET    | /note/get        | Get all notes (current user) | ✅    |
| POST   | /note/create     | Create new note              | ✅    |
| PUT    | /note/update/:id | Update note by ID            | ✅    |
| DELETE | /note/delete/:id | Delete note by ID            | ✅    |

✨ Features
🔐 Authentication
Register with name, email and password

Password validation: min 8 chars, uppercase, lowercase, number (Yup)

Login with email + password

Password visibility toggle (eye icon)

JWT token stored in Redux (persisted across reloads with redux-persist)

Exact backend + Yup validation error messages shown to user

🛡️ Route Protection
/login → redirects to /notes if already logged in

/register → redirects to /notes if already logged in

/notes → redirects to /login if not authenticated

All unknown routes → redirect to /login

Navbar hidden on Login/Register pages automatically

🗒️ Notes CRUD
Create note (title + description)

Edit note (pre-filled modal)

Delete note (confirmation modal — no browser alert)

Notes are per-user (userId isolation on backend)

Notes cleared from Redux on logout (no data leaks between users)

🎨 UI/UX
Sticky glassmorphism Navbar

Avatar badge with first 5 letters of username

Full username shown next to avatar

Responsive grid (1 → 2 → 3 → 4 columns)

Loading spinner only on first load (silent updates after)

Disabled buttons during API calls

Gradient backgrounds + smooth hover transitions

Note creation date shown on each card

🔒 Security
Passwords hashed with bcrypt (salt rounds: 10)

JWT tokens expire in 7 days

Session stored in MongoDB — verified on every protected request

Notes filtered by userId — users can only access their own notes

Redux auth + notes state cleared on logout

CORS configured to allow only localhost:5173


Redux State Shape
javascript
{
  auth: {
    token: "jwt_token_here",
    isLoggedIn: true,
    loading: false,
    error: null,
    user: {
      name: "Abhigyan",
      email: "abhigyan@example.com"
    }
  },
  notes: {
    notes: [...],
    loading: false,
    error: null
  }
}

Environment Variables
| Variable  | Description                         |
| --------- | ----------------------------------- |
| PORT      | Backend server port (default: 8001) |
| URL       | MongoDB connection string           |
| secretKey | JWT signing secret                  |

MIT License — feel free to use and modify!


***

## Key Updates Made

| Section | What Changed |
|---|---|
| Tech Stack | Removed RTK Query, added Yup, added cors |
| File Structure | Updated to match actual current structure with `auth/` and `notes/` folders |
| API Endpoints | Fixed logout to `DELETE`, notes fetch to `/note/get` |
| Features | Updated route protection, added Yup errors, avatar details |
| Redux State | Added `notes` slice to state shape |
| `.env` | Fixed `URL` instead of `MONGO_URI`, removed `mailUser`/`mailPass` |
