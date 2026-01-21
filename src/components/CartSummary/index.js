// Write your code here
import CartContext from '../../context/CartContext'
import './index.css'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value
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
            {cartList.length} Items in cart
          </p>
          <button type="button" className="checkout-btn">
            Checkout
          </button>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
