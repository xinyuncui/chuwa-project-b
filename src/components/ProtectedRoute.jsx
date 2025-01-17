import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (allowedRole && allowedRole !== user.role) {
    return <Navigate to="/error" />; // Redirect if the role does not match
  }

  return children; // Render the children (protected route)
};

export default ProtectedRoute;
