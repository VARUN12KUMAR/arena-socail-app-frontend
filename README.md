# Arina Social App

A decentralized social platform using Ethereum wallet authentication.

## Tech Stack
- Node.js
- NestJS (backend)
- Express
- TypeScript
- React
- Next.js
- RainbowKit & ethers.js (Ethereum wallet login)
- PostgreSQL

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL

## Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Arina-social-app
```

### 2. Install dependencies
#### Frontend
```bash
cd frontend
npm install
```
#### Backend
```bash
cd ../backend
npm install
```

### 3. Configure environment variables
- Copy `.env.example` to `.env` in both `frontend` and `backend` folders and fill in the required values.

### 4. Database setup
- Make sure PostgreSQL is running and a database is created (default: `arina_social`).
- Update your backend `.env` with DB credentials if needed.

### 5. Run the backend
```bash
cd backend
npm run start:dev
```

### 6. Run the frontend
```bash
cd ../frontend
npm run dev
```

### 7. Open the app
- Visit [http://localhost:3001](http://localhost:3001) (or the port shown in your terminal) for the frontend.

## Useful Commands
- `npm run dev` - Start frontend in development mode
- `npm run start:dev` - Start backend in development mode

## Notes
- Login is via Ethereum wallet (RainbowKit + ethers.js)
- Make sure your wallet is connected to the correct network (e.g., Sepolia)
- For profile images, use direct image URLs (ending in .jpg, .png, etc.)

---

For any issues, please open an issue or contact the maintainer.
