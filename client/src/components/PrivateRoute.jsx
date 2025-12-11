import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService.js';

export default function PrivateRoute({ children }) {
  const token = authService.getToken();
  
  // Nếu không có token, redirect về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}