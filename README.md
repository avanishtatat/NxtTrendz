# 🛍️ NxtTrendz – E-Commerce Web Application

🔗 **Live Demo:** https://avanishnxttrend.ccbp.tech/

NxtTrendz is a fully functional **e-commerce web application** built using **React JS**, inspired by modern shopping platforms like Amazon and Flipkart.  
This project demonstrates real-world frontend development concepts including **authentication, protected routes, product filtering, product details, cart management, and payment flow**.

---

## 📌 Project Overview

The NxtTrendz application allows users to:
- Securely log in using authentication
- Browse products with filters and search
- View detailed product information
- Add, update, and manage cart items
- Checkout with a payment popup and place orders
- Experience a responsive and user-friendly UI

---

## 🔑 Demo Login Credentials

Use the following credentials to log in and explore the application:

### Prime User
username: rahul
password: rahul@2021


### Non-Prime User
username: raja
password: raja@2021


> ⚠️ These credentials are for demo purposes only.  
> No real user data is stored.

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

### 💳 Payment Popup *(Static – In Progress)*
- Implemented directly inside the **Cart component** *(not a separate component — planned for refactoring in future)*
- Triggered when the user clicks the **Checkout** button on the Cart page
- Displays a popup with the following payment method options:
  - Card
  - Net Banking
  - UPI
  - Wallet
  - Cash on Delivery
- All payment options except **Cash on Delivery** are disabled
- Popup includes an **Order Summary** showing:
  - Total number of items
  - Total price payable
- **Confirm Order** button is disabled unless **Cash on Delivery** is selected
- On confirming the order, a success message is displayed:  
  *"Your order has been placed successfully"*
- Cart is intentionally **not cleared** after order confirmation — an **Order Tracking page** is planned for a future update

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

## 🔮 Future Plans

- **Order Tracking Page** – A dedicated page to view placed orders and track their status
- **Full Payment Integration** – Enable Card, Net Banking, UPI, and Wallet payment options
- **Clear Cart on Order** – Once the Order Tracking page is in place, the cart will be cleared automatically after a successful order

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
│   ├── Cart             ← Payment Popup is implemented here
│   ├── CartItem
│   ├── CartListView
│   ├── CartSummary
│   └── ProtectedRoute
│
│── context/
│   └── CartContext
│
│── App.js
│── index.js
```