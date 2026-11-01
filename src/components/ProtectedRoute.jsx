import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const location = useLocation();
  useEffect(() => { if (!isAuthenticated) openLoginModal(); }, [isAuthenticated, openLoginModal]);
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />;
  if (role && user.role !== role) return <Navigate to={user.role === 'senior' ? '/senior' : '/dashboard'} replace />;
  return children;
}
