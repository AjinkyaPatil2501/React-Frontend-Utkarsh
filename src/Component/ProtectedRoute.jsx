import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authLoaded } = useSelector((state) => state.auth);

  // Block UI until auth is checked
  if (!authLoaded) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
