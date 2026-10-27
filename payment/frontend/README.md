# Razorpay Backend Test Frontend

Minimal React + Vite page to test a Spring Boot + Razorpay integration.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set:
   - `VITE_API_BASE_URL`
   - `VITE_CREATE_ORDER_PATH`   (placeholder - put your real path)
   - `VITE_VERIFY_PAYMENT_PATH` (placeholder - put your real path)
3. Open `src/api.js` and match the request/response field names (marked TODO).
4. `npm run dev` and open http://localhost:5173

## Backend CORS
Your Spring Boot app must allow `http://localhost:5173` via CORS.

## Files
- `src/data/products.js` - mock products (swap with backend fetch later)
- `src/api.js`           - the only file that talks to your backend
- `src/App.jsx`          - product grid + Razorpay checkout flow
