import {Link, Navigate, useNavigate} from 'react-router-dom'

import './index.css'
import {useState} from 'react'
import axiosInstance from '../../api/axios'
import {useAuth} from '../../context/AuthContext'
import {FiArrowRight, FiLock, FiMail, FiUser} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AuthInput from '../../components/AuthInput'

const SignUp = () => {
  const {token, login: loginUser, user, updatePrimeStatus} = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [loading, setLoading] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [processingPrime, setProcessingPrime] = useState(false)
  //   console.log("Selected plan:", selectedPlan)

  const navigate = useNavigate()

  const onChangeName = event => {
    setName(event.target.value)
  }

  const onChangeEmail = event => {
    setEmail(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onSubmitSuccess = (user, token) => {
    setErrorMsg('')
    setShowSubmitError(false)
    loginUser(user, token)
  }

  const onSubmitFailure = errMsg => {
    setShowSubmitError(true)
    setErrorMsg(errMsg)
  }

  const handlePrimePayment = async () => {
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
            navigate('/')
          } catch (error) {
            console.error('Error verifying payment:', error)
            toast.error(
              'Payment verification failed. Please contact support if your payment was successful.',
            )
            navigate('/')
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
        navigate('/')
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
      navigate('/')
    }
  }

  const submitForm = async event => {
    // console.log("Submitting login form with:", { email, password })
    event.preventDefault()
    setLoading(true)
    const userDetails = {name, email, password}
    try {
      const response = await axiosInstance.post('/auth/register', userDetails)
      onSubmitSuccess(response?.data?.user, response?.data?.token)
      if (selectedPlan === 'prime') {
        setProcessingPrime(true)
        await handlePrimePayment()
      } else {
        toast.success(
          'Account created successfully! You can upgrade to Prime anytime.',
        )
        navigate('/')
      }
    } catch (error) {
      setLoading(false)
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.error?.message ||
        'Something went wrong. Please try again.'
      // console.log("Login error:", error)
      onSubmitFailure(errMsg)
    } finally {
      setLoading(false)
      setProcessingPrime(false)
    }
  }

  const renderSelectMembershipPlan = () => {
    return (
      <>
        <span className="membership-label">SELECT MEMBERSHIP</span>
        <div className="membership-plans-container">
          {/* FREE PLAN */}
          <div
            className={`membership-plan ${
              selectedPlan === 'free' ? 'free-selected' : ''
            }`}
            tabIndex={0}
            onClick={() => setSelectedPlan('free')}
          >
            <div className="membership-plan-header">
              <p className="membership-plan-name">Free</p>
              <div className="membership-plan-tick">✓</div>
            </div>
            <p className="membership-plan-price">₹0</p>
            <p className="membership-plan-description">Basic products</p>
          </div>

          {/* PRIME PLAN */}
          <div
            className={`membership-plan membership-plan-best-value ${
              selectedPlan === 'prime' ? 'prime-selected' : ''
            }`}
            tabIndex={0}
            onClick={() => setSelectedPlan('prime')}
          >
            <span className="membership-plan-badge">Best Value</span>
            <div className="membership-plan-header">
              <p className="membership-plan-name membership-plan-name-best-value">
                Prime
              </p>
              <div className="membership-plan-tick">✓</div>
            </div>
            <p className="membership-plan-price membership-plan-price-best-value">
              ₹499/mo
            </p>
            <p className="membership-plan-description">All deals access</p>
          </div>
        </div>
      </>
    )
  }

  if (token && !processingPrime) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="auth-form-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
        className="auth-website-logo-mobile-img"
        alt="website logo"
      />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="auth-hero-img"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="auth-website-logo-desktop-img"
          alt="website logo"
        />
        <div className="auth-header">
          <h1 className="auth-heading">Create Your Account</h1>
          <p className="auth-subheading">
            Enter your details to start your journey with us!
          </p>
        </div>
        <AuthInput
          label="NAME"
          id="name"
          type="text"
          value={name}
          onChange={onChangeName}
          placeholder="Avanish Tiwari"
          Icon={FiUser}
        />
        <AuthInput
          label="EMAIL"
          id="email"
          type="email"
          value={email}
          onChange={onChangeEmail}
          placeholder="avanishtiwari@example.com"
          Icon={FiMail}
        />
        <AuthInput
          label="PASSWORD"
          id="password"
          type="password"
          value={password}
          onChange={onChangePassword}
          placeholder="••••••••"
          Icon={FiLock}
        />

        <div className="membership-container">
          {renderSelectMembershipPlan()}
        </div>
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
          <FiArrowRight className="submit-btn-icon" />
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link className="auth-footer-link" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp
