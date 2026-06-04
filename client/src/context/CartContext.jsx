import {createContext, useContext, useEffect, useRef, useState} from 'react'
import {useAuth} from './AuthContext'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const CartContext = createContext()

const CartProvider = ({children}) => {
  const {token} = useAuth()
  const [cartList, setCartList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const debounceUpdateRef = useRef(
    debounce(async (id, quantity) => {
      try {
      await axiosInstance.patch(`/cart/${id}`, {quantity})
      } catch (error) {
        console.error('Error updating cart item quantity:', error)
        toast.error('Failed to update cart. Please try again.')
      }
    }, 500),
  )

  useEffect(() => {
    if (token) {
      setIsLoading(true)
      const fetchCart = async () => {
        try {
          const response = await axiosInstance.get('/cart')
          setCartList(response.data?.cartList)
        } catch (error) {
          console.error('Error fetching cart:', error)
          toast.error('Failed to load cart. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchCart()
    } else {
      setCartList([])
    }
  }, [token])

  const toggleIsOpen = () => {
    setIsOpen(prevState => !prevState)
  }

  const removeAllCartItems = async () => {
    const previous = cartList
    setCartList([])
    try {
      await axiosInstance.delete('/cart/')
    } catch (error) {
      console.error('Error clearing cart:', error)
      setCartList(previous)
      toast.error('Failed to clear cart.')
    }
  }

  const removeCartItem = async id => {
    const previous = cartList
    setCartList(prevCartList => prevCartList.filter(item => item.productId !== id))
    try {
      await axiosInstance.delete(`/cart/${id}`)
    } catch (error) {
      console.error('Error removing cart item:', error)
      setCartList(previous)
      toast.error('Failed to remove cart item.')
    }
  }

  const incrementCartItemQuantity = async id => {
    const item = cartList.find(item => item.productId === id)
    setCartList(prevCartList =>
      prevCartList.map(item => {
        if (item.productId === id) {
          return {...item, quantity: item.quantity + 1}
        }
        return item
      }),
    )
    debounceUpdateRef.current(id, item.quantity + 1)
  }

  const decrementCartItemQuantity = id => {
    const item = cartList.find(item => item.productId === id)
    if (item.quantity === 1) {
      removeCartItem(id)
      return
    } 

      setCartList(prevCartList =>
        prevCartList.map(item => {
          if (item.productId === id) {
            return {...item, quantity: item.quantity - 1}
          }
          return item
        }),
      )
      debounceUpdateRef.current(id, item.quantity - 1)
    
  }

  const addCartItem = async product => {
    setCartList(prevCartList => [...prevCartList, {...product, productId: product.id, quantity: 1}])
    try {
      const response = await axiosInstance.post('/cart', {
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        imageUrl: product.imageUrl,
        rating: product.rating,
      })
      setCartList(response.data?.cartList)
    } catch (error) {
      console.error('Error adding item to cart:', error)
      setCartList(prevCartList => prevCartList.filter(item => item.productId !== product.id))
      toast.error('Failed to add item to cart.')
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartList,
        isLoading,
        isOpen,
        toggleIsOpen,
        addCartItem,
        removeCartItem,
        removeAllCartItems,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartProvider
