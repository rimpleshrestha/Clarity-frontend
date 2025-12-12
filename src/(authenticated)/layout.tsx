import { isAuthenticated } from "@/utils/security";

import type { ReactNode } from "react";
import { Link, Navigate, Outlet } from "react-router";
import Sidebar from "./_components/Sidebar";

const ProtectedLayout = () => {
  const auth = isAuthenticated();
  if (!auth) return <Navigate to={"/login"} replace />;

  return (
    <div className="flex relative min-h-screen">
      <aside className="w-[400px] h-full fixed left-0 top-0">
        <Sidebar />
      </aside>

      <main className="flex-1 min-h-full  w-full ml-[400px] overflow-auto  bg-dashboard-bg">
        <Outlet />
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export { ProtectedRoute };
export default ProtectedLayout;
