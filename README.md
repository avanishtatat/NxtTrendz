# NxtTrendz

```text
 _   _  _   _  _______  _______ _______ _______ _______ _______
| \ | || \ | ||__   __||__   __|__   __|__   __|__   __|__   __|
|  \| ||  \| |   | |      | |     | |     | |     | |     | |
| . ` || . ` |   | |      | |     | |     | |     | |     | |
| |\  || |\  |   | |      | |     | |     | |     | |     | |
|_| \_||_| \_|   |_|      |_|     |_|     |_|     |_|     |_|
```

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Demo:** https://avanishnxttrend.ccbp.tech _(legacy frontend, pending full-stack redeploy)_

**GitHub:** https://github.com/avanishtatat/NxtTrendz

**Built by:** Avanish Tiwari

## Overview

NxtTrendz is a full-stack e-commerce application that evolved from a frontend-only React project into a production-style shopping platform with a Node.js + Express backend, MongoDB persistence, JWT authentication, and Razorpay-powered payments. It supports user registration with Free/Prime plan selection, protected shopping flows, persistent carts, and order history. The frontend uses React 18 with Vite, Context API, Axios interceptors, and reusable payment/cart flows. The backend proxies product data from NxtWave APIs and keeps sensitive operations such as payment verification, subscription updates, and order creation on the server.

> Note: The current codebase uses plain CSS and react-icons. Tailwind CSS and Lucide React are not part of the verified implementation.

## Features

- 🔐 Authentication with JWT-based registration, login, logout, and protected routes.
- 👤 Free/Prime plan selection during signup, plus Prime upgrade from the deals banner.
- 🛍️ Product browsing with search, category filters, ratings filter, and product details pages.
- ⭐ Prime-only deals locked behind an active subscription.
- 🛒 Persistent cart stored in MongoDB with quantity updates, optimistic UI, and auto-load on login.
- 💳 Razorpay checkout integration for both cart checkout and Prime subscription.
- 🧾 Server-side Razorpay signature verification before order creation or Prime activation.
- 📦 Order history and order detail views backed by MongoDB.
- ⚡ Shared `usePrimePayment` hook and lazy Razorpay SDK loading for reusable payment flows.
- 🔁 Token refresh on app load through the auth profile endpoint so Prime status stays current.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite, React Router DOM v6, Axios, React Hot Toast, react-icons, react-loader-spinner, react-modal, Context API |
| Backend | Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, Bcrypt, Razorpay Node SDK, Axios proxy to NxtWave APIs |
| Styling | Plain CSS / component-scoped CSS |
| Payments | Razorpay checkout.js (loaded on demand) |
| Modules | ES Modules (`import` / `export`) |

## Screenshots

Replace these placeholders with real screenshots from your deployment.

| Screen | Placeholder |
| --- | --- |
| Home | `./docs/screenshots/home.png` |
| Products | `./docs/screenshots/products.png` |
| Product Details | `./docs/screenshots/product-details.png` |
| Cart | `./docs/screenshots/cart.png` |
| Prime Upgrade | `./docs/screenshots/prime-upgrade.png` |

## Getting Started

### Prerequisites

- Node.js 20.19 or later
- MongoDB Atlas account
- Razorpay test account
- NxtWave API credentials for Prime and Free users

### Clone the repository

```bash
git clone https://github.com/avanishtatat/NxtTrendz.git
cd NxtTrendz
```

### Setup the server

```bash
cd server
npm install
```

Create `server/.env` using the values below, then start the API:

```bash
npm run dev
```

### Setup the client

```bash
cd ../client
npm install
```

Create `client/.env`, then run the frontend:

```bash
npm run dev
```

## Environment Variables

### `server/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes | Server port, usually `5000` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWTs |
| `RAZORPAY_KEY_ID` | Yes | Razorpay public key used by the server |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret key used for signature verification |
| `NXTWAVE_PRIME_USERNAME` | Yes | NxtWave Prime API username |
| `NXTWAVE_PRIME_PASSWORD` | Yes | NxtWave Prime API password |
| `NXTWAVE_FREE_USERNAME` | Yes | NxtWave Free API username |
| `NXTWAVE_FREE_PASSWORD` | Yes | NxtWave Free API password |
| `CLIENT_URL` | Yes | Frontend origin for CORS, e.g. `http://localhost:3000` |

### `client/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Backend API base URL, e.g. `http://localhost:5000/api/v1` |
| `VITE_RAZORPAY_KEY` | Yes | Razorpay key passed to the checkout widget |

## API Endpoints

All protected endpoints require a valid JWT.

| Domain | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Auth | POST | `/api/v1/auth/register` | Register a new user |
| Auth | POST | `/api/v1/auth/login` | Login existing user |
| Auth | GET | `/api/v1/auth/profile` | Fetch current user profile and latest Prime status |
| Products | GET | `/api/v1/products` | Fetch products list |
| Products | GET | `/api/v1/products/prime` | Fetch Prime-only products |
| Products | GET | `/api/v1/products/:id` | Fetch single product details |
| Cart | GET | `/api/v1/cart` | Fetch authenticated user cart |
| Cart | POST | `/api/v1/cart` | Add item to cart |
| Cart | PATCH | `/api/v1/cart/:productId` | Update item quantity |
| Cart | DELETE | `/api/v1/cart/:productId` | Remove a single cart item |
| Cart | DELETE | `/api/v1/cart` | Clear the full cart |
| Orders | GET | `/api/v1/orders` | Fetch order history |
| Orders | GET | `/api/v1/orders/:orderId` | Fetch a single order |
| Payments | POST | `/api/v1/payments/create-order` | Create a Razorpay order for cart checkout |
| Payments | POST | `/api/v1/payments/verify-payment` | Verify Razorpay cart payment signature |
| Payments | POST | `/api/v1/payments/create-prime-order` | Create a Razorpay order for Prime subscription |
| Payments | POST | `/api/v1/payments/verify-prime-payment` | Verify Prime payment and activate membership |

## Project Structure

```text
NxtTrendz/
├── client/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── Cart/
│       │   ├── CartItem/
│       │   ├── CartListView/
│       │   ├── CartSummary/
│       │   ├── FiltersGroup/
│       │   ├── Header/
│       │   ├── Home/
│       │   ├── PrimeDealsSection/
│       │   ├── ProductCard/
│       │   ├── ProductItemDetails/
│       │   ├── Products/
│       │   ├── ProductsHeader/
│       │   ├── SimilarProductItem/
│       │   └── ProtectedRoute/
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── hooks/
│       │   └── usePrimePayment.js
│       ├── pages/
│       │   ├── Auth/
│       │   │   ├── LogIn.jsx
│       │   │   └── SignUp.jsx
│       │   ├── Order/
│       │   │   ├── Orders.jsx
│       │   │   └── OrderSuccess.jsx
│       │   ├── Home/
│       │   ├── Products/
│       │   └── Cart/
│       └── App.jsx
├── server/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── README.md
```

## How It Works

### Authentication

Users register with a selected plan and receive a JWT after successful signup or login. The frontend stores the token in `localStorage`, and authenticated requests use Axios interceptors. On app load, the client calls the profile endpoint to refresh user data and Prime status. Protected routes redirect unauthenticated users to the login page.

### Product Data

The server proxies product requests to NxtWave APIs and caches the upstream token in memory for 55 minutes. The client then uses the authenticated product endpoints to render the catalog, filters, prime deals, and product details pages.

### Prime Subscription

The Prime upgrade flow starts from registration or from the Prime deals banner. The client requests a Razorpay order from the server, then loads the Razorpay SDK on demand through the reusable `usePrimePayment` hook. After payment, the client sends the Razorpay payment details back to the server for HMAC SHA256 verification. If verification succeeds, the server updates `isPrime`, stores the 30-day expiry in MongoDB, and returns a new JWT so the frontend can refresh the user session.

### Cart and Orders

The cart is persisted in MongoDB and scoped per user. Cart updates are applied optimistically in the UI and reverted on failure. Order checkout creates a Razorpay order first, then verifies the payment signature on the server before the order is written. Duplicate payment processing is guarded on the backend, and order history is available from the orders API.

## Demo Credentials

These credentials are useful for exploring the Prime and Free flows in the current setup.

| Account | Username | Password |
| --- | --- | --- |
| Prime | `rahul` | `rahul@2021` |
| Free | `raja` | `raja@2021` |

## Future Improvements

- Selective cart checkout
- Multiple chat sessions
- Cursor-based pagination for orders
- Order cancellation
- Admin dashboard
- Live-mode Razorpay payments
- Push notifications for order updates
- Product reviews and ratings
- Wishlist feature
- Address management

## Author

**Avanish Tiwari**

- NxtWave MERN developer
- Open to work
- LinkedIn: https://www.linkedin.com/in/avanishtiwari18
- GitHub: https://github.com/avanishtatat

## License

MIT License
