import type { Role } from "../context/AuthContext/AuthProvider";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

interface MyComponentProps {
  role: Role | Role[];
}

export const ProtectedRoutes = ({ role: allowedRoles }: MyComponentProps) => {
  const { auth } = useAuth();
  const userRole = auth?.user?.role;

  const isAllowed =
    userRole &&
    (Array.isArray(allowedRoles)
      ? allowedRoles.includes(userRole)
      : allowedRoles === userRole);

  return isAllowed ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/needlogin" />
  );
};
