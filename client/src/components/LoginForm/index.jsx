import { Link, Navigate, useNavigate } from 'react-router-dom'

import './index.css'
import { useState } from 'react'
import axiosInstance from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const LoginForm = () => {
  const { token, login: loginUser } = useAuth();
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
      const errMsg = error?.response?.data?.error || error?.response?.data?.error?.message || 'Something went wrong. Please try again.'
      onSubmitFailure(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const renderPasswordField = () => {
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  const renderEmailField = () => {
    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="email"
          id="email"
          className="email-input-field"
          value={email}
          onChange={onChangeEmail}
          placeholder="Email"
        />
      </>
    )
  }

  if (token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="login-form-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
        className="login-website-logo-mobile-img"
        alt="website logo"
      />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="login-img"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <div className="input-container">{renderEmailField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <p className='auth-footer-text'>Don't have an account? <Link className='auth-footer-link' to="/signup">Sign Up</Link></p>
      </form>
      
    </div>
  )
}

export default LoginForm
