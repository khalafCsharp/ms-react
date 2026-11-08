import { useAuth } from "./AuthProvider";
import { Navigate, Outlet } from "react-router";
import { LoaderCircle } from "lucide-react";

function ProtectedRoute({ allowedRoles }) {


   const { user, loading } = useAuth();


   if (loading) return <LoaderCircle />; 

  if (!user) {
    return <Navigate to="login" />;
  }

  // Authenticated but doesn't have the required role
  const hasRole = user.roles?.some((role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to="/forbidden" />;

  }

  return <Outlet />;
}

export default ProtectedRoute;
