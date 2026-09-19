# FreshCart — Grocery Delivery App

Full MERN stack grocery delivery app: React frontend, Express +
MongoDB backend, JWT auth, and 5 CRUD resources. Built for the "Mega
basic project" roadmap task (Option 2: Grocery Delivery eCommerce).

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

### 3. Become an admin

Registering never grants admin — promote a user directly in MongoDB
after they've registered:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Admins can manage categories/products at `/admin` and update order
statuses. Add at least one category before adding products (products
require a category).

## The 5 CRUD resources

| Resource | Create | Read | Update | Delete | Notes |
|---|---|---|---|---|---|
| **User** | register | `/me` | — | — | Auth only; role set via DB, not API |
| **Category** | admin | public | admin | admin | Grocery categories (Produce, Dairy, etc.) |
| **Product** | admin | public, filter by category/search | admin | admin | Has `unit` (kg, pack, each...) |
| **Cart** | add item | view own | update qty | remove item / clear | One cart per user |
| **Order** | checkout | own orders / admin sees all | admin sets status | owner cancels (pending only) | Snapshots price at time of order, decrements stock |

## Auth flow

- **Register** (`POST /api/auth/register`) and **Login**
  (`POST /api/auth/login`) both return `{ user, token }`. The frontend
  stores the token in `localStorage` and an axios interceptor
  (`src/api/client.js`) attaches it to every request automatically.
- **Protected routes** — backend: `middleware/auth.js` (`protect`)
  guards cart, orders, `/me`, and all admin mutations; `middleware/
  admin.js` further restricts category/product mutations and
  admin-only order actions. Frontend: `<ProtectedRoute>` redirects to
  `/login` if there's no logged-in user (and to `/` if `adminOnly` is
  set and the user isn't an admin).

## Try it (once both are running with a real DB)

1. Go to `http://localhost:3000/register`, create an account.
2. Promote yourself to admin in the DB (see above), refresh.
3. Go to `/admin`, add a category, then a product.
4. Go to `/` (Shop), add the product to your cart.
5. Go to `/cart`, enter a delivery address, place the order.
6. Go to `/orders` — see your order; go to `/admin` — update its status.

## Testing notes (important — read this)

Built and verified in a sandbox with **no MongoDB access** (no local
`mongod`, binary download blocked by network policy). What *was*
verified by actually running both halves:

- Backend: every route curl-tested — auth-required routes correctly
  401 before touching the DB, validation errors and invalid-ObjectId
  errors return correctly (Mongoose validates before writing, so these
  don't need a live connection).
- Frontend: `npm run build` and `npm start` both compile with zero
  errors — confirms the router, Context API auth state, and all 6
  pages wire together correctly.
- **Both running simultaneously** (backend :5000, frontend :3000): a
  CORS preflight request from the frontend's actual origin was sent
  with the `Authorization` header included (the exact header the
  axios interceptor adds for authenticated requests) and confirmed
  allowed — so the full authenticated request path is confirmed
  reachable, not just assumed.

**Not verified** (needs a real MongoDB + a browser): actually
registering, logging in, adding products as admin, adding to cart, and
placing an order end-to-end. The code path is written and the
frontend-backend connection is confirmed real — this is the one thing
to click through before calling it done.

## Deployment (for the "Live URL" requirement)

- **Backend** → [Render](https://render.com) or
  [Railway](https://railway.app): connect the repo, root directory
  `backend`, add `MONGO_URI` and `JWT_SECRET` as environment variables
  (MongoDB Atlas free tier for the connection string).
- **Frontend** → [Vercel](https://vercel.com) or
  [Netlify](https://netlify.com): connect the repo, root directory
  `frontend`, add `REACT_APP_API_URL` pointing at the deployed
  backend's URL.

## Acceptance criteria mapping

- ✅ Full auth flow (register, login, protected routes) — see "Auth
  flow" above.
- ✅ At least 5 CRUD resources — User, Category, Product, Cart, Order
  (table above).
- ⏳ Deployed and publicly accessible — not yet deployed (needs your
  Render/Vercel/Atlas accounts); instructions above.
- ✅ Clean, readable codebase — MVC-style backend (models/controllers/
  routes/middleware), component/page/api separation on the frontend,
  consistent patterns reused across both.
