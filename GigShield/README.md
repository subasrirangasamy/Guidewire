# GigShield - AI-Powered Income Protection Platform

GigShield is a parametric insurance platform designed for gig delivery workers in India (Zomato, Swiggy, etc.). It protects workers from income loss caused by external disruptions like extreme weather, pollution, or local restrictions. The system utilizes automated claim triggering and payouts based on real-time data.

## Features

- **User Module**: Register, login, and view Dashboard with active policies, claims, and earnings protected.
- **Insurance Policy System**: Dynamic premium calculation based on location and risk level, generating coverage limits and validity.
- **AI-Based Risk Assessment**: Analyzes location to adjust the premium dynamically.
- **Parametric Trigger System**: Checks for disruptions (Heavy Rain, Extreme Heat, Pollution) and auto-triggers claims.
- **Automated Claims & Payouts**: Automated claim initiation with no manual filing required.
- **Fraud Detection**: Simple validation restricting duplicate claims within 24 hours.
- **Admin Dashboard**: Analytics on total users, claims processed, risk analytics, and disruption charts.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Recharts, Lucide-React
- **Backend**: Node.js, Express.js, MongoDB (Memory Server for easy demo execution), JWT, BcryptJS

## How to Run

### 1. Start the Backend

The backend uses `mongodb-memory-server` out of the box so you don't even need to configure a local MongoDB instance!

```bash
cd backend
npm install
node server.js
```
The backend will run on `http://localhost:5000`.

### 2. Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`. Open this URL in your browser.

## Using the Application

1. **Register**: Create a new account. By default, any email containing `admin` will be registered as an Admin user.
2. **Dashboard**: Navigate to your dashboard, click "Get Income Protection Quote", review your custom quote, and click "Buy Policy".
3. **Simulate Disruption**: Once your policy is active, click "Run AI Check" in the orange box to simulate checking a weather API. It has a chance to trigger a disruption (e.g., Heavy Rain) and automatically credit a claim to your history.
4. **Admin Dashboard**: Login with an `admin` email and click the "Admin" link in the Navbar to see platform-wide analytics and charts.
