import {useState} from 'react'
import {IoMdClose} from 'react-icons/io'
import Header from '../Header'
import CartListView from '../CartListView'

import CartContext from '../../context/CartContext'
import EmptyCartView from '../EmptyCartView'
import CartSummary from '../CartSummary'

import './index.css'

const Cart = () => {
  const [method, setMethod] = useState('')
  const [isConfirmOrder, setIsConfirmOrder] = useState(false)
  return (
    <CartContext.Consumer>
      {value => {
        const {cartList, removeAllCartItems, isOpen, setIsOpen} = value
        const showEmptyView = cartList.length === 0

        const onClickRemoveAll = () => {
          removeAllCartItems()
        }
        const orderTotal = (cartList || []).reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        )

        return (
          <>
            <Header />
            <div className="cart-container">
              {showEmptyView ? (
                <EmptyCartView />
              ) : (
                <div className="cart-content-container">
                  <h1 className="cart-heading">My Cart</h1>
                  <button
                    type="button"
                    className="remove-all-btn"
                    onClick={onClickRemoveAll}
                  >
                    Remove All
                  </button>
                  <CartListView />
                  <CartSummary />
                  {/* React modal implementation is commented out for now, will
                  be implemented in future */}
                  {/* <ReactModal
                  isOpen={isOpen}
                  onRequestClose={setIsOpen}
                  className="modal"
                  overlayClassName="overlay"
                >
                  <h2>Payment Popup</h2>
                </ReactModal> */}
                  {isOpen && (
                    <div className="overlay">
                      <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-heading">
                          <h2>Payment</h2>
                          <button
                            className="close-button"
                            type="button"
                            onClick={() => {
                              setIsOpen(!isOpen)
                              setMethod('')
                              setIsConfirmOrder(false)
                            }}
                          >
                            <IoMdClose size={18} />
                          </button>
                        </div>
                        <hr />
                        <div className="modal-body">
                          <form className="payment-options">
                            <label className="payment-method disable">
                              <input
                                type="radio"
                                name="payment"
                                value="card"
                                disabled
                              />{' '}
                              Card
                            </label>
                            <label className="payment-method disable">
                              <input
                                type="radio"
                                name="payment"
                                value="netbanking"
                                disabled
                              />{' '}
                              Net Banking
                            </label>
                            <label className="payment-method disable">
                              <input
                                type="radio"
                                name="payment"
                                value="upi"
                                disabled
                              />{' '}
                              UPI
                            </label>
                            <label className="payment-method disable">
                              <input
                                type="radio"
                                name="payment"
                                value="wallet"
                                disabled
                              />{' '}
                              Wallet
                            </label>
                            <label className="payment-method">
                              <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked={method === 'cod'}
                                onChange={e => setMethod(e.target.value)}
                              />
                              Cash on Delivery
                            </label>
                          </form>
                          <hr />
                          <div className="summary-container">
                            <div className="summary">
                              <p>
                                <b>Number of Items:</b> {cartList.length}
                              </p>
                              <p>
                                <b>Total Price:</b> Rs {orderTotal}
                              </p>
                            </div>
                            <div className="button-container">
                              <button
                                type="button"
                                className={`confirm-button ${
                                  method === 'cod' ? 'green' : ''
                                }`}
                                disabled={method !== 'cod' || isConfirmOrder }
                                onClick={() => {
                                  setIsConfirmOrder(true)
                                  removeAllCartItems()
                                }}
                              >
                                Confirm Order
                              </button>
                            </div>
                          </div>
                          {isConfirmOrder && (
                            <p className="confirm-message">
                              Your order has been placed successfully
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )
      }}
    </CartContext.Consumer>
  )
}

export default Cart
