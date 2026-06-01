import { createContext, useContext, useEffect, useState } from "react"
import axiosInstance from "../api/axios"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            axiosInstance.get("/auth/profile")
                .then((response) => {
                    setUser(response.data)
                })
                .catch((error) => {
                    logout()
                })
        }
    }, [token])

    const login = (userData, token) => {
        setUser(userData)
        setToken(token)
        localStorage.setItem("token", token)
        navigate('/')
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        navigate('/login')
    }

    const updatePrimeStatus = (isPrime, token) => {
        setUser((prevUser) => ({
            ...prevUser,
            isPrime,
        }))
        localStorage.setItem("token", token)
        setToken(token)
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