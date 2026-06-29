# 🛒 SHOPIRE — Frontend

> A modern electronics e-commerce storefront built with vanilla HTML, CSS & JavaScript.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📸 Overview

SHOPIRE is a fully responsive electronics store frontend featuring product browsing, cart management, user authentication, an admin dashboard, and a checkout flow — all connected to a REST API backend.

---

## 📁 Project Structure

```
shopire-frontend/
├── index.html              # Homepage
├── shop.html               # All products
├── product-detail.html     # Single product page
├── cart.html               # Shopping cart
├── checkout.html           # Checkout page
├── orders.html             # Order history
├── login.html              # User login/register
├── blog.html               # Blog page
├── contact.html            # Contact page
├── category-*.html         # Category pages (smartphones, laptops, tablets, etc.)
├── admin/
│   ├── index.html          # Admin dashboard
│   └── login.html          # Admin login
├── css/                    # Stylesheets
└── js/                     # JavaScript files
    ├── api.js              # API base URL & fetch helpers
    ├── shopire-nav.js      # Navigation component
    └── ...
```

---

## 🚀 Getting Started

### Run Locally

No build step needed — just open in browser:

```bash
# Clone the repo
git clone https://github.com/syntralogic/shopire-frontend.git
cd shopire-frontend

# Open in browser
open index.html
# or use Live Server in VS Code
```

### Connect to Backend

Open `js/api.js` and set your backend URL:

```js
// Development
const API_BASE = 'http://localhost:5000';

// Production
const API_BASE = 'https://your-backend-url.onrender.com';
```

---

## ✨ Features

- 🏠 Dynamic homepage with hero banner & product sections
- 🛍️ Shop page with filtering & sorting
- 📦 Product detail page
- 🛒 Cart with quantity management
- 💳 Checkout flow
- 🔐 User login & registration (JWT-based)
- 📋 Order history
- 🖥️ Admin dashboard (product & order management)
- 📱 Fully responsive design
- 🤖 AI Chat assistant (Shopire Chat)
- 🗂️ Category pages: Smartphones, Laptops, Tablets, Headphones, Cameras, Audio, Wearables, Monitors, Gaming, Furniture

---

## 🌐 Deployment

Deployed on **Vercel** — [Live Demo](https://shopire-frontend.vercel.app)

To deploy your own:
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework: **Other** → Deploy ✅

---

## 🔗 Related

- 🔧 Backend Repo: [shopire-backend](https://github.com/syntralogic/shopire-backend)

---

## 👤 Author

**SyntraLogic**  
GitHub: [@syntralogic](https://github.com/syntralogic)