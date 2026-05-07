import {Component} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
    isOpen: false,
  }

  setIsOpen = () => {
    this.setState(prevState => ({isOpen: !prevState.isOpen}))
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item
  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  incrementCartItemQuantity = (productId, productQty) => {
    const {cartList} = this.state
    const updateCartList = cartList.map(eachProduct => {
      if (eachProduct.id === productId) {
        return {...eachProduct, quantity: eachProduct.quantity + productQty}
      }
      return eachProduct
    })
    this.setState({cartList: updateCartList})
  }

  decrementCartItemQuantity = product => {
    const {cartList} = this.state
    const {id, quantity} = product
    if (quantity === 1) {
      this.removeCartItem(id)
    } else {
      const updateCartList = cartList.map(eachProduct => {
        if (eachProduct.id === id) {
          return {...eachProduct, quantity: eachProduct.quantity - 1}
        }
        return eachProduct
      })
      this.setState({cartList: updateCartList})
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedCartList = cartList.filter(eachItem => eachItem.id !== id)
    this.setState({cartList: updatedCartList})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const findProduct = cartList.find(
      eachProduct => eachProduct.id === product.id,
    )
    if (findProduct === undefined) {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    } else {
      this.incrementCartItemQuantity(product.id, product.quantity)
    }

    //   TODO: Update the code here to implement addCartItem
  }

  render() {
    const {cartList, isOpen} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          isOpen,
          setIsOpen: this.setIsOpen,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/products/:id"
              element={<ProductItemDetails />}
            />
            <Route path="/cart" element={<Cart />} />
          </Route>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </CartContext.Provider>
    )
  }
}

export default App
