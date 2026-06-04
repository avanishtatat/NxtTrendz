import CartContext, {useCart} from '../../context/CartContext'
import './index.css'

const CartSummary = () => {
  const {cartList, setIsOpen} = useCart()

  const orderTotal = cartList.reduce(
    (acc, sum) => acc + sum.price * sum.quantity,
    0,
  )

  return (
    <div className="cart-summary-card">
      <h1 className="cart-summary-total">
        Order Total:{' '}
        <span className="order-total-amount">Rs {orderTotal}/-</span>
      </h1>
      <p className="cart-summary-item-count">
        {cartList.length} {cartList.length === 1 ? 'Item' : 'Items'} in cart
      </p>
      <button type="button" className="checkout-btn" onClick={setIsOpen}>
        Checkout
      </button>
    </div>
  )
}

export default CartSummary
