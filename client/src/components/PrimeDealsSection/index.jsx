import {Component} from 'react'
import { ThreeDots } from 'react-loader-spinner'

import ProductCard from '../ProductCard'

import './index.css'
import axiosInstance from '../../api/axios'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    apiStatus: apiStatusConstants.initial,
  }

  _isMounted = false

  componentDidMount() {
    this._isMounted = true
    this.getPrimeDeals()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    try {
      const response = await axiosInstance.get('/products/prime')
      if (response.status === 200) {
        const fetchedData = response.data
        const updatedData = fetchedData.prime_deals.map(product => ({
          title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      if (this._isMounted) {
        this.setState({
          primeDeals: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      }
    } 
    if (response.status === 403) {
      if (this._isMounted) {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    }
  } catch (error) {
    console.error("Error fetching prime deals:", error?.response?.data?.error_msg || error.message)
      if (this._isMounted) {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    }
  }

  renderPrimeDealsListView = () => {
    const {primeDeals} = this.state
    return (
      <div>
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="register prime"
      className="register-prime-img"
    />
  )

  renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsListView()
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
