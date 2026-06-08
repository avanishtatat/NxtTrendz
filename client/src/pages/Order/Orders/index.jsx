import {useEffect, useState} from 'react'
import Header from '../../../components/Header'
import axiosInstance from '../../../api/axios'
import toast from 'react-hot-toast'

import './index.css'
import OrderSkeleton from '../../../components/OrderSkeleton'
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaShoppingBag,
} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/orders')
        setOrders(response.data.orders)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error(
          error?.response?.data?.error ||
            'Failed to load orders. Please try again.',
        )
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div>
      <Header />
      {loading ? (
        <OrderSkeleton />
      ) : orders.length === 0 ? (
        <div className="no-orders-container">
          <div className="order-icon-container">
            <FaShoppingBag size={48} className="shopping-bag-icon" />
            <FaSearch className="no-orders-search-icon" />
          </div>
          <h2 className="no-orders-title">No orders yet</h2>
          <p className="no-orders-message">
            Your orders will appear here after you make a purchase. Discover the
            latest trends today.
          </p>
          <button
            className="start-shopping-btn"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-container">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-description">View and track your orders.</p>
          <ul className="order-list-container">
            {orders.map(order => (
              <li
                key={order._id}
                className="order-item"
                onClick={() => {
                  setOpenIndex(openIndex === order._id ? null : order._id)
                }}
              >
                <div className="order-header">
                  <div className="order-left-content">
                    <h2 className="order-id">{`#${order._id
                      .slice(-8)
                      .toUpperCase()}`}</h2>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      • {order.items.length}{' '}
                      {order.items.length > 1 ? 'items' : 'item'}
                    </span>
                  </div>
                  <div className="order-right-content">
                    <p className="order-amount">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="order-status">{order.orderStatus}</p>
                    <button
                      className="order-details-btn"
                      onClick={e => {
                        e.stopPropagation()
                        setOpenIndex(openIndex === order._id ? null : order._id)
                      }}
                    >
                      {openIndex === order._id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>
                </div>
                {openIndex === order._id && (
                  <div className="order-details-container">
                    {order.items.map(item => (
                      <div key={item.productId} className="order-product-item">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="order-product-image"
                        />
                        <div className="order-product-info">
                          <h3 className="order-product-name">{item.title}</h3>
                          <p className="order-product-brand">{item.brand}</p>
                        </div>
                        <div className="order-product-quantity">
                          <p className="item-quantity">Qty: {item.quantity}</p>
                          <p className="item-price">
                            ₹
                            {(item.price * item.quantity).toLocaleString(
                              'en-IN',
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {openIndex === order._id && (
                  <span className="order-total">
                    Total: ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Orders
