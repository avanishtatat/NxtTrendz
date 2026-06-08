import toast from 'react-hot-toast'
import axiosInstance from '../../api/axios'
import {useCart} from '../../context/CartContext'
import './index.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { loadRazorpayScript } from '../../utils/loadRazorpayScript'

const CartSummary = () => {
  const {cartList, removeAllCartItems} = useCart()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const { user } = useAuth() ?? {}
  const navigate = useNavigate()

  const orderTotal = cartList.reduce(
    (acc, sum) => acc + sum.price * sum.quantity,
    0,
  )

  const handleCheckout = async () => {
    if (isProcessingPayment) {
      return
    }
    setIsProcessingPayment(true)
    try {
      const response = await axiosInstance.post('/payments/create-order')
      const {razorpayOrderId, amount, currency} = response.data

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded || typeof window.Razorpay !== 'function') {
        toast.error('Payment service is currently unavailable. Please refresh and try again.')
        return
      }
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount.toString(),
        currency,
        order_id: razorpayOrderId,
        name: 'NxtTrendz',
        description: 'Order Payment',
        handler: async response => {
          const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = response
          try {
            const verifyResponse = await axiosInstance.post('/payments/verify-payment',{
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
            })
            removeAllCartItems()
            toast.success(verifyResponse.data?.message || 'Payment successful! Your order has been placed.')
            navigate('/order-success', {
              state: {
                orderId: verifyResponse.data?.orderId,
                orderAmount: verifyResponse.data?.totalAmount,
              }
            })
          } catch (error) {
            console.error('Payment verification failed:', error)
            toast.error(error?.response?.data?.error || 'Payment verification failed. Please contact support.')

          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#F37254',
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        toast.error('Payment failed. Please try again.')
      })
      rzp.open()
      
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Checkout failed. Please try again.')
      setIsProcessingPayment(false)
      navigate('/cart')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="cart-summary-card">
      <h1 className="cart-summary-total">
        Order Total:{' '}
        <span className="order-total-amount">Rs {orderTotal}/-</span>
      </h1>
      <p className="cart-summary-item-count">
        {cartList.length} {cartList.length === 1 ? 'Item' : 'Items'} in cart
      </p>
      <button type="button" className="checkout-btn" onClick={handleCheckout} disabled={isProcessingPayment}>
        {isProcessingPayment ? 'Processing...' : 'Checkout'}
      </button>
    </div>
  )
}

export default CartSummary
