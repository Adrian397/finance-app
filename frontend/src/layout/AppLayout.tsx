import type { ReactElement } from "react";
import { useAuthStore } from "@/stores/authStore.ts";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar/Sidebar.tsx";
import "./AppLayout.scss";

export const AppLayout = (): ReactElement => {
  const { user } = useAuthStore();

  return (
    <div className="layout">
      <Sidebar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};
