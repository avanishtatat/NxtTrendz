import {useState} from 'react'
import './index.css'
import {FiEye, FiEyeOff} from 'react-icons/fi'

const AuthInput = ({label, id, type, value, onChange, placeholder, Icon}) => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState)
  }

  const inputType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type
  return (
    <div className="input-container">
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" />}
        <input
          type={inputType}
          id={id}
          className="input-field"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FiEyeOff className="toggle-icon" />
            ) : (
              <FiEye className="toggle-icon" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default AuthInput
