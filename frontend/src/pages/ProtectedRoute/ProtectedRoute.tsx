import React, { type ReactElement, useEffect } from "react";
import "./ProtectedRoute.scss";
import { Navigate } from "react-router-dom";
import { initializeAuth, useAuthStore } from "@/stores/authStore";
import { AppLayout } from "@/layout/AppLayout";
import { PulseLoader } from "react-spinners";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";

const ProtectedRoute = (): ReactElement | null => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initializeAuth();
  }, []);

  if (token && isLoadingUser && !user) {
    return (
      <div className="loading-screen">
        <PulseLoader
          color={"#201F24"}
          loading={true}
          size={32}
          aria-label="Loading home screen..."
        />
      </div>
    );
  }

  if (!isAuthenticated && !isLoadingUser) {
    return <Navigate to={ROUTE_PATHS.AUTH} replace />;
  }

  return isAuthenticated ? <AppLayout /> : null;
};

export default ProtectedRoute;
