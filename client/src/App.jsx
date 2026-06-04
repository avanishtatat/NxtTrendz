import {Component} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'

import LoginForm from './pages/Auth/LogIn'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'
import SignUp from './pages/Auth/SignUp'

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignUp />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductItemDetails />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
    <Route path="/not-found" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/not-found" />} />
  </Routes>
)

export default App
