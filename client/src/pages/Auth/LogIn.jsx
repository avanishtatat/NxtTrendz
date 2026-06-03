import {Link, Navigate, useNavigate} from 'react-router-dom'

import './index.css'
import {useState} from 'react'
import axiosInstance from '../../api/axios'
import {useAuth} from '../../context/AuthContext'
import {FiArrowRight, FiLock, FiMail} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AuthInput from '../../components/AuthInput'

const LoginForm = () => {
  const {token, login: loginUser} = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

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
    toast.success('Logged in successfully!')
    navigate('/')
  }

  const onSubmitFailure = errMsg => {
    setShowSubmitError(true)
    setErrorMsg(errMsg)
  }

  const submitForm = async event => {
    event.preventDefault()
    setLoading(true)
    const userDetails = {email, password}
    try {
      const response = await axiosInstance.post('/auth/login', userDetails)
      onSubmitSuccess(response?.data?.user, response?.data?.token)
    } catch (error) {
      setLoading(false)
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.error?.message ||
        'Something went wrong. Please try again.'
      onSubmitFailure(errMsg)
    } finally {
      setLoading(false)
    }
  }

  if (token) {
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
          <h1 className="auth-heading">Welcome Back!</h1>
          <p className="auth-subheading">
            Enter your details to access your account and explore latest deals!
          </p>
        </div>
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
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
          <FiArrowRight className="submit-btn-icon" />
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link className="auth-footer-link" to="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm
