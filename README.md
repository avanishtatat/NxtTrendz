# 🛍️ NxtTrendz – E-Commerce Web Application

🔗 **Live Demo:** https://avanishnxttrend.ccbp.tech/

NxtTrendz is a fully functional **e-commerce web application** built using **React JS**, inspired by modern shopping platforms like Amazon and Flipkart.  
This project demonstrates real-world frontend development concepts including **authentication, protected routes, product filtering, product details, and cart management**.

---

## 📌 Project Overview

The NxtTrendz application allows users to:
- Securely log in using authentication
- Browse products with filters and search
- View detailed product information
- Add, update, and manage cart items
- Experience a responsive and user-friendly UI

---

## 🚀 Features

### 🔐 Authentication
- User login with username & password
- JWT-based authentication
- Error handling for invalid credentials
- Successful login redirects to Home page

---

### 🛡️ Protected Routes
- Home, Products, Product Details, and Cart routes are protected
- Unauthenticated users are redirected to Login
- Logged-in users cannot access Login again

---

### 🏠 Home Page
- Landing page after successful login
- Navigation to Products and Cart
- Fully responsive design

---

### 🛒 Products Page
- Fetches products from secured APIs
- Search products by title
- Filter products by:
  - Category
  - Rating
- Clear filters functionality
- Loader while fetching data
- Failure and No Products views handled

---

### 📄 Product Details Page
- Displays detailed product information
- Shows similar products
- Quantity increment & decrement
- Minimum quantity validation
- Loader and failure views implemented

---

### 🛍️ Cart Features
- Add products to cart
- Increment / decrement product quantity
- Remove individual cart items
- Remove all cart items
- Automatic cart total calculation
- Empty cart view handling

---

## 🧰 Tech Stack

- **Frontend:** React JS
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Authentication:** JWT
- **Styling:** CSS3
- **Icons:** react-icons
- **API Integration:** REST APIs
- **Package Manager:** npm

---

## 🔗 API Endpoints Used

| Feature | Method | Endpoint |
|--------|--------|----------|
| Login | POST | https://apis.ccbp.in/login |
| Products | GET | https://apis.ccbp.in/products |
| Product Details | GET | https://apis.ccbp.in/products/:id |

---

## 📁 Folder Structure

```text
src/
│── components/
│   ├── LoginForm
│   ├── Home
│   ├── Header
│   ├── Products
│   ├── FiltersGroup
│   ├── ProductItemDetails
│   ├── Cart
│   ├── CartItem
│   ├── CartSummary
│   └── ProtectedRoute
│
│── context/
│   └── CartContext
│
│── App.js
│── index.js
```
