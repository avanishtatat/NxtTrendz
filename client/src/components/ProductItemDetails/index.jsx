import {Component} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {ThreeDots} from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import {useCart} from '../../context/CartContext'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'
import axiosInstance from '../../api/axios'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    isAlreadyInCart: false,
  }

  _isMounted = false

  componentDidMount() {
    this._isMounted = true
    this.getProductData()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {params} = this.props
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    try {
      const response = await axiosInstance.get(`/products/${id}`)
      if (response.status === 200) {
        const fetchedData = response.data
        const updatedData = this.getFormattedData(fetchedData.product)
        const updatedSimilarProductsData = fetchedData.product.similar_products.map(
          eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
        )
        const {cartList} = this.props
        const isAlreadyInCart = cartList.some(
          item => item.productId === updatedData.id,
        )
        if (this._isMounted) {
          this.setState({
            productData: updatedData,
            similarProductsData: updatedSimilarProductsData,
            apiStatus: apiStatusConstants.success,
            isAlreadyInCart,
          })
        }
      } else {
        if (this._isMounted) {
          this.setState({
            apiStatus: apiStatusConstants.failure,
          })
        }
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products" className="button">
        Continue Shopping
      </Link>
    </div>
  )

  setIsAlreadyInCart = value => {
    this.setState({isAlreadyInCart: value})
  }

  renderProductDetailsView = () => {
    const {productData, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData
    const {
      addCartItem,
      navigate,
    } = this.props
    const onClickAddToCart = () => {
      addCartItem(productData)
    }

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {price}/-</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>

            {this.state.isAlreadyInCart ? (
              <button
                className="button go-to-cart-btn"
                onClick={() => navigate('/cart')}
              >
                GO TO CART
              </button>
            ) : (
              <button
                type="button"
                className="button add-to-cart-btn"
                onClick={() => {
                  onClickAddToCart()
                  this.setIsAlreadyInCart(true)
                }}
              >
                ADD TO CART
              </button>
            )}
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

const ProductItemDetailsWrapper = () => {
  const navigate = useNavigate()
  const params = useParams()
  const {addCartItem, cartList} = useCart()

  return (
    <ProductItemDetails
      params={params}
      addCartItem={addCartItem}
      navigate={navigate}
      cartList={cartList}
    />
  )
}

export default ProductItemDetailsWrapper
