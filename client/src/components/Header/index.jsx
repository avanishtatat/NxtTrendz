import {Link, NavLink} from 'react-router-dom'

import {useAuth} from '../../context/AuthContext'
import {useCart} from '../../context/CartContext'
import { FaShoppingBag } from "react-icons/fa";

import './index.css'

const Header = () => {
  const {logout} = useAuth()
  const {cartList} = useCart()

  const renderCartItemsCount = () => {

    return (
      <>
        {cartList.length > 0 ? (
          <span className="cart-count-badge">{cartList.reduce((acc, item) => acc + item.quantity, 0)}</span>
        ) : null}
      </>
    )
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              alt="website logo"
            />
          </Link>

          <button type="button" className="nav-mobile-btn" onClick={logout}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-img"
            />
          </button>
        </div>

        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Home
              </NavLink>
            </li>

            <li className="nav-menu-item">
              <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Products
              </NavLink>
            </li>

            <li className="nav-menu-item">
              <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Cart
                {renderCartItemsCount()}
              </NavLink>
            </li>
            <li className="nav-menu-item">
              <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Orders
              </NavLink>
            </li>
          </ul>
          <button type="button" className="logout-desktop-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link mobile-active" : "nav-link")}>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                alt="nav home"
                className="nav-bar-img"
              />
            </NavLink>
          </li>

          <li className="nav-menu-item-mobile">
            <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link mobile-active" : "nav-link")}>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                alt="nav products"
                className="nav-bar-img"
              />
            </NavLink>
          </li>
          <li className="nav-menu-item-mobile">
            <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link mobile-active" : "nav-link")}>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                alt="nav cart"
                className="nav-bar-img"
              />
              {renderCartItemsCount()}
            </NavLink>
          </li>
          <li className="nav-menu-item-mobile">
            <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link mobile-active" : "nav-link")}>
              <FaShoppingBag size={20} className='nav-order-icon'/>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header
