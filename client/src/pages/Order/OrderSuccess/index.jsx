import {Navigate, useLocation, useNavigate} from 'react-router-dom'
import Header from '../../../components/Header'
import { FaTruckMoving } from "react-icons/fa";

import './index.css'

const OrderSuccess = () => {
  const {state} = useLocation()
  const navigate = useNavigate()

  if (!state) return <Navigate to="/orders" replace />
  
  const {orderId, orderAmount} = state 

  return (
    <>
      <Header />
      <div className="order-success-container">
        <div
          className="animated-svg-container"
          id="animated-svg-ANIMATION_2"
          style={{ display: 'block' }}
        >
          <svg
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#22c55e"
              strokeDasharray="283"
              strokeDashoffset="283"
              strokeWidth="8"
            >
              <animate
                attributeName="stroke-dashoffset"
                dur="0.6s"
                fill="freeze"
                from="283"
                to="0"
              ></animate>
            </circle>
            <path
              d="M30 50L45 65L70 35"
              stroke="#22c55e"
              strokeDasharray="100"
              strokeDashoffset="100"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            >
              <animate
                attributeName="stroke-dashoffset"
                begin="0.6s"
                dur="0.4s"
                fill="freeze"
                from="100"
                to="0"
              ></animate>
            </path>
          </svg>
        </div>
        <h1 className="order-success-heading">Order Placed Successfully!</h1>
        <p className="order-success-message">
          Thank you for your purchase. Your order is being
          processed and will be on its way to you shortly.
        </p>
        <div className="order-details">
          <p className="order-detail">
            <span className="order-detail-label">Order ID</span>{' '}
            <span className="order-detail-value bold-value">ORD-{orderId.slice(-8).toUpperCase() || 'N/A'}</span>
          </p>
          <p className="order-detail">
            <span className="order-detail-label">Amount Paid</span>{' '}
            <span className="order-detail-value bold-value">
              Rs {orderAmount ? orderAmount.toFixed(2) : 'N/A'}/-
            </span>
          </p>
          <p className='order-detail'>
            <span className="order-detail-label">Payment Status</span>{' '}
            <span className="paid-badge">Paid</span>
          </p>
          <p className='order-detail'>
            <span className="order-detail-label">Order Status</span>{' '}
            <span className="processing-badge">Processing</span>
          </p>
          <p className='order-detail'>
            <span className='order-detail-label'>Estimated Delivery</span>{' '}
            <div className='delivery-truck-icon-container'>
                <FaTruckMoving className='delivery-truck-icon' />
            <span className='order-detail-value'>
                3-5 business days</span>
            </div>
          </p>

        </div>
        <div className='action-buttons-container'>
            <button className='action-button view-orders-button' onClick={() => navigate('/orders')}>
                View My Orders
            </button>
            <button className='action-button continue-shopping-button' onClick={() => navigate('/products')}>
                Continue Shopping
            </button>
        </div>
      </div>
    </>
  )
}

export default OrderSuccess
