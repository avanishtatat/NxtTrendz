import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../api/axios'
import {useCallback} from 'react'
import {useAuth} from '../context/AuthContext'
import {loadRazorpayScript} from '../utils/loadRazorpayScript'

export const usePrimePayment = ({page = 'home'} = {}) => {
  const navigate = useNavigate()
  const {user, updatePrimeStatus} = useAuth()

  const navigateAfterPayment = useCallback(() => {
    if (page === 'products') {
      navigate('/products')
      return
    }

    navigate('/')
  }, [navigate, page])

  const initiatePrimePayment = useCallback(async () => {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded || typeof window.Razorpay !== 'function') {
      console.error('Razorpay SDK failed to load.')
      toast.error(
        'Payment service is unavailable right now. Please refresh and try again.',
      )
      navigateAfterPayment()
      return
    }

    try {
      const response = await axiosInstance.post('/payments/create-prime-order')
      const {razorpayOrderId, amount, currency} = response.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount.toString(),
        currency,
        order_id: razorpayOrderId,
        name: 'NxtTrendz',
        description: 'Prime Membership - 30-day access',
        handler: async response => {
          const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          } = response
          try {
            const verifyResponse = await axiosInstance.post(
              '/payments/verify-prime-payment',
              {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
              },
            )

            const {token: newToken, user: updatedUser} = verifyResponse.data
            updatePrimeStatus(
              updatedUser.isPrime,
              newToken,
              updatedUser.primeExpiresAt,
            )
            toast.success(
              'Payment successful! Your account has been upgraded to Prime.',
            )
            navigateAfterPayment()
          } catch (error) {
            console.error('Error verifying payment:', error)
            toast.error(
              'Payment verification failed. Please contact support if your payment was successful.',
            )
            navigateAfterPayment()
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#0b69ff',
        },
      }
      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed. You can upgrade your plan later.')
        navigateAfterPayment()
      })

      rzp.open()
    } catch (error) {
      console.error(
        'Error initiating Razorpay payment:',
        error.response?.data || error?.message,
      )
      toast.error(
        'Failed to initiate payment. Please try again later or contact support.',
      )
      navigateAfterPayment()
    }
  }, [navigateAfterPayment, updatePrimeStatus, user])

  return initiatePrimePayment
}
