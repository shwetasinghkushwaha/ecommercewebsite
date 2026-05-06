# 🛒 MERN Shop Pro — B.Tech Final Year E-Commerce Project

A production-ready, full-stack MERN e-commerce application with **JWT auth**, **admin panel**, **wishlist**, **reviews & ratings**, **dark mode**, **pagination**, and **demo checkout**. Designed for B.Tech final-year viva and submission.

> ⚠️ Demo only — no real payment gateway. No deployment instructions included.

---

## 📁 Folder Structure

```
mern-shop/
├── backend/
│   ├── config/        db.js
│   ├── controllers/   auth, product, cart, order, wishlist
│   ├── middleware/    authMiddleware, errorMiddleware
│   ├── models/        User, Product, Cart, Order
│   ├── routes/        authRoutes, productRoutes, cartRoutes, orderRoutes, wishlistRoutes
│   ├── utils/         generateToken.js, seed.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  Navbar, Footer, ProductCard, ProtectedRoute,
    │   │                AdminRoute, Spinner, EmptyState, Pagination
    │   ├── context/     AuthContext, CartContext, WishlistContext, ThemeContext
    │   ├── pages/       Home, ProductDetails, Login, Register, Cart,
    │   │                Wishlist, Checkout, OrderSuccess, MyOrders, Admin, NotFound
    │   ├── services/    api.js (axios instance)
    │   ├── App.jsx, main.jsx, index.css
    │   └── ...
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js 18+
- MongoDB (local `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env       # then edit MONGO_URI / JWT_SECRET
npm run seed               # seeds 12 products + admin user
npm run dev                # starts API on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm run dev                # starts app on http://localhost:5173
```

### 4. Default admin login
```
email:    admin@shop.com
password: admin123
```

---

## ✨ Features

### 🔐 Authentication
- Register / Login with JWT
- Password hashing with bcrypt
- **Auto-login** on refresh (token validated via `/api/auth/me`)
- Logout clears session
- Protected routes (Cart, Checkout, Wishlist, My Orders)
- Admin-only route (`/admin`)

### 🛍️ Products
- Search by name/description
- Filter by category
- **Filter by price range** (min / max)
- **Sort**: Newest, Price ↑, Price ↓, Top Rated
- **Pagination** (8 per page)
- Product details page
- **Ratings & reviews** (logged-in users can post one review per product)

### 🛒 Cart
- Quantity +/− controls
- Dynamic total calculation
- Persisted in MongoDB (per-user) — survives refresh & re-login
- Remove items

### ❤️ Wishlist
- Heart toggle on every product card
- Dedicated `/wishlist` page
- Move to cart from wishlist

### 📦 Orders
- Demo checkout (no real payment)
- Order history page (`/my-orders`)
- Status badges: `Processing → Shipped → Delivered` (or `Cancelled`)
- Admin can change order status

### 👨‍💻 Admin Dashboard
- Stat cards: total products, total orders, demo revenue
- Tab 1: Add / delete products, view product table
- Tab 2: View all orders + change status

### 🎨 UI / UX
- Fully responsive (mobile + desktop)
- 🌙 **Dark mode toggle** (persisted in localStorage)
- Loading spinners
- Toast notifications (react-hot-toast)
- Empty states (no products / no orders / empty cart)
- Modern card grid layout with TailwindCSS

---

## 🗄️ MongoDB Schemas (summary)

**User**: `name, email, password (hashed), isAdmin, wishlist[ProductId]`
**Product**: `name, description, price, image, category, stock, rating, numReviews, reviews[{user, name, rating, comment}]`
**Cart**: `user, items[{ product, qty }]`
**Order**: `user, items[{product,name,image,price,qty}], shippingAddress, totalAmount, paymentMethod, status`

---

## 🌐 API Endpoints

### Auth — `/api/auth`
| Method | Path        | Auth | Description           |
|--------|-------------|------|-----------------------|
| POST   | `/register` | —    | Create account        |
| POST   | `/login`    | —    | Login + JWT           |
| GET    | `/me`       | ✅   | Current user (auto-login) |

### Products — `/api/products`
| Method | Path                | Auth   | Description |
|--------|---------------------|--------|-------------|
| GET    | `/`                 | —      | List w/ `search, category, minPrice, maxPrice, sort, page, limit` |
| GET    | `/categories`       | —      | Distinct categories |
| GET    | `/:id`              | —      | Single product (with reviews) |
| POST   | `/`                 | Admin  | Create product |
| PUT    | `/:id`              | Admin  | Update product |
| DELETE | `/:id`              | Admin  | Delete product |
| POST   | `/:id/reviews`      | ✅     | Add review `{rating, comment}` |

### Cart — `/api/cart`
| Method | Path           | Auth | Description |
|--------|----------------|------|-------------|
| GET    | `/`            | ✅   | Get my cart |
| POST   | `/`            | ✅   | Add item `{productId, qty}` |
| PUT    | `/:productId`  | ✅   | Update qty |
| DELETE | `/:productId`  | ✅   | Remove item |
| DELETE | `/`            | ✅   | Clear cart |

### Orders — `/api/orders`
| Method | Path              | Auth   | Description |
|--------|-------------------|--------|-------------|
| POST   | `/`               | ✅     | Place order (demo) |
| GET    | `/mine`           | ✅     | My order history |
| GET    | `/`               | Admin  | All orders |
| PATCH  | `/:id/status`     | Admin  | Update status |

### Wishlist — `/api/wishlist`
| Method | Path             | Auth | Description |
|--------|------------------|------|-------------|
| GET    | `/`              | ✅   | My wishlist |
| POST   | `/toggle`        | ✅   | Add/remove `{productId}` |
| DELETE | `/:productId`    | ✅   | Remove |

---

## 🧪 Quick Test Flow (for viva)

1. `npm run seed` → DB has 12 products + admin.
2. Register a new user → auto-redirected, JWT stored.
3. Browse Home → use search, category, price range, sort, pagination.
4. Open a product → ❤️ wishlist it, add review.
5. Add to cart, change qty, refresh page → cart persists.
6. Checkout → order goes to "Processing" in My Orders.
7. Logout, login as `admin@shop.com / admin123` → go to `/admin` → change order status to "Shipped".
8. Toggle 🌙 dark mode in navbar.

---

## 🏗️ Architecture Highlights (mention in viva)

- **MVC structure** in backend (models, controllers, routes, middleware).
- **Context API** in frontend for global state (Auth, Cart, Wishlist, Theme).
- **Reusable components**: `ProductCard`, `Spinner`, `EmptyState`, `Pagination`.
- **Centralized axios service** (`services/api.js`) with JWT auto-attach.
- **Route guards**: `ProtectedRoute` and `AdminRoute`.
- **Schema-level password hashing** via Mongoose pre-save hook.
- **Server-side filtering, sorting & pagination** for scalability.

---

Made for B.Tech final year submission ✨
