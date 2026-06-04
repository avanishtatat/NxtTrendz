import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {AiFillCloseCircle, AiOutlineDelete} from 'react-icons/ai'

import {useCart} from '../../context/CartContext'

import './index.css'

const CartItem = props => {
  const {
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
  } = useCart()
  const {cartItemDetails} = props
  const {productId, title, brand, quantity, price, imageUrl} = cartItemDetails
  const onRemoveCartItem = () => {
    removeCartItem(productId)
  }
  // TODO: Update the functionality to increment and decrement quantity of the cart item
  const onClickMinus = () => {
    decrementCartItemQuantity(productId)
  }

  const onClickPlus = () => {
    incrementCartItemQuantity(productId)
  }

  return (
    <li className="cart-item">
      <img className="cart-product-image" src={imageUrl} alt={title} />
      <div className="cart-item-details-container">
        <div className="cart-product-title-brand-container">
          <p className="cart-product-title">{title}</p>
          <p className="cart-product-brand">by {brand}</p>
        </div>
        <div className="cart-quantity-container">
          <button
            type="button"
            className="quantity-controller-button"
            onClick={onClickMinus}
            data-testid="minus"
          >
            {quantity === 1 ? <AiOutlineDelete color="#52606D" size={12} /> : <BsDashSquare color="#52606D" size={12} />}
          </button>
          <p className="cart-quantity">{quantity}</p>
          <button
            type="button"
            className="quantity-controller-button"
            onClick={onClickPlus}
            data-testid="plus"
          >
            <BsPlusSquare color="#52606D" size={12} />
          </button>
        </div>
        <div className="total-price-remove-container">
          <p className="cart-total-price">
            Rs {(price * quantity).toFixed(2)}/-
          </p>
          <button
            className="remove-button"
            type="button"
            onClick={onRemoveCartItem}
            data-testid="remove"
          >
            Remove
          </button>
        </div>
      </div>
      <button
        className="delete-button"
        type="button"
        onClick={onRemoveCartItem}
      >
        <AiFillCloseCircle color="#616E7C" size={20} />
      </button>
    </li>
  )
}

export default CartItem
