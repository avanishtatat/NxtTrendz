import CartItem from '../CartItem'
import CartContext, {useCart} from '../../context/CartContext'

import './index.css'

const CartListView = () => {
  const {cartList} = useCart()

  return (
    <ul className="cart-list">
      {cartList.map(eachCartItem => (
        <CartItem key={eachCartItem.productId} cartItemDetails={eachCartItem} />
      ))}
    </ul>
  )
}
export default CartListView
