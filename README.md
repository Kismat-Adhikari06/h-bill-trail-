# H-Bill — Restaurant Billing & Invoice Management System

A full-stack web application for managing restaurant bills, generating QR codes for customer payment, and tracking order statuses in real time.

## Live Demo

- **Frontend:** [https://h-bill-trail-eight.vercel.app](https://h-bill-trail-eight.vercel.app)
- **Backend API:** [https://h-bill-api.onrender.com/api](https://h-bill-api.onrender.com/api)

## Features

- **Admin Dashboard** — View all bills with stat cards, date filters (Today, Yesterday, This Week, This Month, This Year), and expandable item details
- **Bill Management** — Create new bills, edit existing ones, and update bill statuses (Open → Closed → Paid)
- **QR Code Generation** — Generate unique QR codes for closed bills so customers can scan and view their bill
- **Bill Receipt View** — Customer-facing bill page showing all items, quantities, and totals
- **User Dashboard** — Regular users can save and view their bills
- **Role-Based Access** — Admin and user roles with separate dashboards and permissions
- **Collapsible Sidebar** — Icon-based sidebar with collapse/expand toggle, responsive across all screen sizes
- **Responsive Design** — Fully responsive layout for desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Vite, Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
h-bill/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # API client functions (bills, auth, savedBills)
│   │   ├── components/      # Reusable components (Sidebar)
│   │   ├── context/         # Auth context (AuthProvider)
│   │   ├── pages/           # Page components
│   │   │   ├── DashboardPage.jsx    # Admin dashboard
│   │   │   ├── CreateBillPage.jsx   # Bill creation form
│   │   │   ├── EditBillPage.jsx     # Bill edit form
│   │   │   ├── QRPage.jsx           # QR code display
│   │   │   ├── BillPage.jsx         # Customer bill receipt
│   │   │   ├── UserPage.jsx         # User dashboard
│   │   │   └── LoginPage.jsx        # Login / Signup
│   │   ├── App.jsx          # Routes and layout
│   │   └── index.css        # Global styles
│   └── package.json
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/          # Database and env config
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB models (bills, users, savedBills)
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Error handling, response helpers
│   │   └── index.js         # Server entry point
│   ├── database/
│   │   └── seed.js          # Database seed script
│   └── package.json
└── vercel.json
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/signup` | Create a new user account |

### Bills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bills` | Get all bills |
| GET | `/api/bills/:id` | Get a single bill by ID |
| POST | `/api/bills` | Create a new bill |
| PUT | `/api/bills/:id` | Update a bill |
| GET | `/api/bills/:id/qr` | Generate QR code for a bill |

### Saved Bills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved/:userId` | Get saved bills for a user |
| POST | `/api/saved/:userId/:billId` | Save a bill to a user |

## Bill Status Flow

```
Open → Closed → Paid
```

- **Open** — Bill is active, items can be added/edited
- **Closed** — Bill is finalized, QR code available for customer payment
- **Paid** — Payment completed, QR code removed

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hbill.com | admin123 |
| Admin | manager@hbill.com | manager123 |
| User | user@hbill.com | user123 |
| User | staff@hbill.com | staff123 |
| User | riya@hbill.com | riya123 |

## Getting Started (Local Development)

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local instance or Atlas connection string)

### Setup

```bash
# Clone the repository
git clone https://github.com/Kismat-Adhikari06/h-bill-trail-.git
cd h-bill-trail-

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=hbill
FRONTEND_URL=http://localhost:3000
```

### Seed the Database

```bash
cd server
npm run db:seed
```

### Run the Application

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import repo on Vercel
3. Set environment variable:
   - `VITE_API_URL` = `https://h-bill-api.onrender.com/api`

### Backend (Render)

1. Create a new Web Service on Render
2. Connect the GitHub repo
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `MONGODB_DB` = `hbill`
   - `NODE_VERSION` = `20`
   - `FRONTEND_URL` = your Vercel URL

### Database (MongoDB Atlas)

1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist IP `0.0.0.0/0` under Network Access
4. Seed the database or insert documents via Data Explorer
