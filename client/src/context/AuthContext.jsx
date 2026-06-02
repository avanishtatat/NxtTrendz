import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import axiosInstance from "../api/axios"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const optimisticPrimeRef = useRef(null)
    const navigate = useNavigate()

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        navigate('/login')
    }, [navigate])

    useEffect(() => {
        if (token) {
            axiosInstance.get("/auth/profile")
                .then((response) => {
                    const fetchedUser = response.data.user ?? response.data
                    const optimisticPrime = optimisticPrimeRef.current

                    if (
                        optimisticPrime &&
                        (fetchedUser?.isPrime !== optimisticPrime.isPrime ||
                            fetchedUser?.primeExpiresAt !== optimisticPrime.primeExpiresAt)
                    ) {
                        setUser({
                            ...fetchedUser,
                            isPrime: optimisticPrime.isPrime,
                            primeExpiresAt: optimisticPrime.primeExpiresAt,
                        })
                        return
                    }

                    optimisticPrimeRef.current = null
                    setUser(fetchedUser)
                })
                .catch((error) => {
                    logout()
                })
        }
    }, [token, logout])

    const login = (userData, token) => {
        setUser(userData)
        setToken(token)
        localStorage.setItem("token", token)
    }


    const updatePrimeStatus = (isPrime, newToken, newExpiry) => {
        optimisticPrimeRef.current = {
            isPrime,
            primeExpiresAt: newExpiry,
        }

        setUser((prevUser) => ({
            ...prevUser,
            isPrime,
            primeExpiresAt: newExpiry
        }))
        if (newToken) {
            localStorage.setItem("token", newToken)
            setToken(newToken)
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updatePrimeStatus }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export default AuthProvider