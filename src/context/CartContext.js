import React from 'react'

const CartContext = React.createContext({
  cartList: [],
  isOpen: false,
  setIsOpen: () => {},
  removeAllCartItems: () => {},
  addCartItem: () => {},
  removeCartItem: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
})

export default CartContext
