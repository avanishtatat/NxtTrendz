import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import AuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" toastOptions={{
          duration: 3000
        }} />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
