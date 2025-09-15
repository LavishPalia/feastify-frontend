// src/components/PublicRoute.tsx
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

type PublicRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export default function PublicRoute({
  children,
  redirectTo = "/",
}: PublicRouteProps) {
  const { user } = useAppSelector((state) => state.user);

  if (user) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
}
