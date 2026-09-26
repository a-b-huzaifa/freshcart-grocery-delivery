# FreshCart — Grocery Delivery App

Full MERN stack grocery delivery app: React frontend, Express + MongoDB backend, JWT auth, and 5 CRUD resources. Built for the "Mega basic project" roadmap task (Option 2: Grocery Delivery eCommerce).

## Project structure

```
grocery-delivery-app/
  backend/     <- Express + Mongoose API
  frontend/    <- Create React App client (React Router, Context API)
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to a real MongoDB connection string,
# and JWT_SECRET to a long random string
npm run dev      # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env already points at http://localhost:5000 by default
npm start         # http://localhost:3000
```

### 3. Database Seeding

You can quickly populate your database with 15 realistic grocery products across 5 categories, as well as an admin user, by running the seed script:

```bash
cd backend
node seed.js
```

This creates an admin account with:
- **Email:** `admin@freshcart.com`
- **Password:** `password123`

*(Note: If you register manually, you will not have admin access. You must promote a user directly in MongoDB: `db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })`)*

## The 5 CRUD resources

| Resource | Create | Read | Update | Delete | Notes |
|---|---|---|---|---|---|
| **User** | register | `/me` | — | — | Auth only; role set via DB, not API |
| **Category** | admin | public | admin | admin | Grocery categories (Produce, Dairy, etc.) |
| **Product** | admin | public, filter by category/search | admin | admin | Has `unit` (kg, pack, each...) |
| **Cart** | add item | view own | update qty | remove item / clear | One cart per user |
| **Order** | checkout | own orders / admin sees all | admin sets status | owner cancels (pending only) | Snapshots price at time of order, decrements stock |

## Features & UI

The frontend includes a fully responsive, modern brutalist design system (CSS variables in `index.css`) featuring:
- **Global Toast Notifications** instead of static error banners.
- **Quick View Modals** on product cards for detailed views.
- **Client-Side Filtering & Sorting** (Search, Category chips, Sort by price, and In Stock toggle).
- **Dynamic Cart Badge** in the Navbar utilizing a global `CartContext`.
- **Skeleton Loaders** for all network requests.
- **Quantity Steppers** (+/-) for precise cart management.
- **Order Stats** (lifetime items and spending) on the Orders page.
- **Admin Panel Tabs** for a cleaner management interface.

## Auth flow

- **Register** (`POST /api/auth/register`) and **Login** (`POST /api/auth/login`) both return `{ user, token }`. The frontend stores the token in `localStorage` and an axios interceptor (`src/api/client.js`) attaches it to every request automatically.
- **Protected routes** — backend: `middleware/auth.js` (`protect`) guards cart, orders, `/me`, and all admin mutations; `middleware/admin.js` further restricts category/product mutations and admin-only order actions. Frontend: `<ProtectedRoute>` redirects to `/login` if there's no logged-in user (and to `/` if `adminOnly` is set and the user isn't an admin).

## Testing Flow

1. Run `node seed.js` in the backend.
2. Log in at `http://localhost:3000/login` using `admin@freshcart.com` / `password123`.
3. Check out the `/admin` panel to see the seeded categories and products.
4. Go to the Shop page (`/`), filter by category, sort by price, and add some items to your cart.
5. Go to `/cart`, adjust quantities, enter a delivery address, and checkout.
6. Check your `/orders` to see your lifetime stats and current order status!
