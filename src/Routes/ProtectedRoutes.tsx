import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoutes = () => {
    const { auth } = useAuth();

  return auth?.user ? < Outlet />: <Navigate to='/unauthorized'/>
}
