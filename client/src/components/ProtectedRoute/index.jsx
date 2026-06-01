import {Navigate, Outlet} from 'react-router-dom'
import Cookie from 'js-cookie'
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
