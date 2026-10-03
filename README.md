# 🛍️ Guntur Store - Fullstack E-Commerce Hub (Day 12)

Welcome to **Guntur Store**, a fullstack, production-grade e-commerce application built on **FastAPI**, **React 18**, **Tailwind CSS**, **Shadcn/ui Components**, **React Hook Form**, and **Zod Validation**.

### 🌟 Key Highlights & Features:
- **Strict Role-Based Access Control (RBAC)**: Dedicated Admin Operations Hub (`/admin`) for inventory/product management; retail customer access with automated checkout locks for administrators.
- **Amazon-Style Single-Use Coupons Engine**: Promotional coupon directory with single-use per customer enforcement, minimum spend requirements, and real-time discount deduction.
- **Dynamic Coupon Creator**: Admins can issue custom promo codes on the fly with custom discount rates, min-spend thresholds, and expiration dates.
- **Customer Wishlist (❤️)**: Save favorite products for later, live navbar counter badge, and 1-click "Move to Cart" transition.
- **Live Search, Sorting & Price Filter**: Sort products by Newest, Price (Low to High / High to Low), Alphabetical, with quick presets and custom price range filtering.
- **Multi-Step Validated Checkout**: 4-step wizard with Zod schemas for shipping, delivery speed, payment, and review.
- **Real-Time Live Updates**: WebSocket order status updates and Redis-backed high-speed shopping cart.

---

## 📁 Day 12 Project Structure

```
12_tailwind_shadcn_forms_validation/
├── frontend/                           # React 18 + Vite + Tailwind + Shadcn/ui
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx          # Theme switcher, DropdownMenu, live cart badge
│   │   │   │   ├── Layout.jsx          # Shell with global Toaster & responsive container
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── product/
│   │   │   │   └── ProductCard.jsx     # Responsive card with stock urgency & buy now
│   │   │   └── ui/                     # Shadcn/ui Core Component Suite
│   │   │       ├── button.jsx          # 7 CVA variants, 4 sizes, loading spinner
│   │   │       ├── dialog.jsx          # Radix modal dialog with focus trapping
│   │   │       ├── table.jsx           # Responsive data table components
│   │   │       ├── dropdown-menu.jsx   # Radix dropdown menu
│   │   │       ├── sonner.jsx          # Sonner toast provider & toast helper
│   │   │       ├── tabs.jsx            # Tab panels for Admin and Lab
│   │   │       ├── form.jsx            # RHF accessible form primitives (ARIA)
│   │   │       ├── image-dropzone.jsx  # react-dropzone with live preview & metadata
│   │   │       ├── card.jsx, badge.jsx, input.jsx, label.jsx, textarea.jsx
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx        # Dark / Light / System theme strategy
│   │   │   ├── AuthContext.jsx         # User authentication & token persistence
│   │   │   └── CartContext.jsx         # Redis shopping cart sync
│   │   ├── lib/
│   │   │   └── utils.js                # cn() class merging utility (clsx + twMerge)
│   │   ├── schemas/
│   │   │   ├── authSchemas.js          # Zod login & registration schemas with match refinement
│   │   │   ├── productSchemas.js       # Zod product & dynamic specification schemas
│   │   │   └── checkoutSchemas.js      # Multi-step checkout step schemas (conditional superRefine)
│   │   ├── pages/
│   │   │   ├── Day12LabPage.jsx        # Interactive Day 12 Showcase Lab (6 dedicated testbeds)
│   │   │   ├── ProductsPage.jsx        # Catalog with search, filters & pagination
│   │   │   ├── ProductDetailPage.jsx   # Product detail & inventory view
│   │   │   ├── LoginPage.jsx           # RHF + Zod validated login with 1-click demo fill
│   │   │   ├── RegisterPage.jsx        # RHF + Zod validated registration
│   │   │   ├── CartPage.jsx            # Real-time cart editor
│   │   │   ├── CheckoutPage.jsx        # 4-Step Multi-Step Checkout Wizard
│   │   │   ├── OrdersPage.jsx          # Order history
│   │   │   ├── OrderTrackingPage.jsx   # Live tracking with WebSocket updates
│   │   │   └── AdminPage.jsx           # Shadcn Table, Dialog, Dropdown & 4-Step Product Wizard
│   │   ├── App.jsx                     # Route definitions & Context providers
│   │   ├── index.css                   # Tailwind directives & Shadcn HSL theme variables
│   │   └── main.jsx                    # Application entrypoint
│   ├── postcss.config.js               # PostCSS tailwindcss & autoprefixer config
│   ├── tailwind.config.js              # Tailwind tokens, dark mode & animation plugins
│   └── vite.config.js                  # Proxy rules for /api and /ws
└── backend/                            # FastAPI E-Commerce Hub
    ├── app/
    │   ├── main.py                     # FastAPI lifespan, middleware, routers
    │   ├── database.py                 # SQLite engine & session
    │   ├── models/                     # SQLAlchemy models (User, Product, Order)
    │   ├── routers/                    # REST routers & WebSocket endpoints
    │   ├── schemas/                    # Pydantic validation schemas
    │   └── services/                   # Redis cache & Celery task services
    ├── scripts/
    │   └── seed_data.py                # Database seeder (Admin, Customer, Catalog)
    └── run.py                          # Uvicorn runner on port 8000
```

---

## 🚀 How to Run

### Terminal 1: Launch Backend Hub
```powershell
cd 12_tailwind_shadcn_forms_validation/backend
python scripts/seed_data.py
python run.py
```

### Terminal 2: Launch Frontend SPA
```powershell
cd 12_tailwind_shadcn_forms_validation/frontend
npm.cmd run dev
```

### Open in Browser
- **Day 12 Interactive Mastery Lab**: [http://localhost:5173/day12-lab](http://localhost:5173/day12-lab)
- **Storefront**: [http://localhost:5173/](http://localhost:5173/)
- **Multi-Step Checkout**: [http://localhost:5173/checkout](http://localhost:5173/checkout)
- **Admin Control Hub**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
