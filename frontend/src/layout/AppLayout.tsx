import { type ReactElement, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar/Sidebar.tsx";
import "./AppLayout.scss";
import { useAuthStore } from "@/stores/authStore.ts";

const REFRESH_INTERVAL = 4 * 60 * 1000;
export const AppLayout = (): ReactElement => {
  const attemptRefreshToken = useAuthStore(
    (state) => state.attemptRefreshToken,
  );
  useEffect(() => {
    const interval = setInterval(() => {
      attemptRefreshToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [attemptRefreshToken]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};
