import { useAuth } from "../context/authContext";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useEffect } from "react";

export function ProtectedRoute({
  children,
  onUserChange,
  isAllowed,
  redirectTo = "/",
}) {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (onUserChange) {
      onUserChange(user, loading);
    }
  }, [user, onUserChange, loading]);

  if (loading) return <Spin size="large" className="absolute justify-center" />;

  if (!user) return <Navigate to="/register" />;

  if (!isAllowed) return <Navigate to={redirectTo} />;

  return children ? children : <Outlet />;
}
