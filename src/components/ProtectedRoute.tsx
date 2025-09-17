import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

type ProtectedRouteProps = {
  children: ReactNode;
  redirectTo?: string;
  allowedRoles?: string[];
};

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
}: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.user);

  if (!user) return <Navigate to={redirectTo} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
