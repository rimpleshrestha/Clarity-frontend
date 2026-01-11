import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Menu } from "lucide-react"; // Optional icons
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { isAuthenticated } from "@/utils/security";

const ProtectedLayout = () => {
  const auth = isAuthenticated();
  const location = useLocation();

  // Track if we are on a large screen
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Initially closed for all

  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024;
      setIsLargeScreen(isLg);
      // Auto-open if it's a large screen on initial load
      if (isLg) setIsOpen(true);
      else setIsOpen(false);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-close sidebar on mobile when navigating to a new route
  useEffect(() => {
    if (!isLargeScreen) setIsOpen(false);
  }, [location.pathname, isLargeScreen]);

  if (!auth) return <Navigate to={"/login"} replace />;

  return (
    <div className="flex relative min-h-screen overflow-x-hidden bg-dashboard-bg dark:bg-black">
      <Header />

      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && !isLargeScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-[300px] h-full fixed left-0 top-0 z-40 bg-white dark:bg-zinc-950 border-r shadow-xl"
      >
        <Sidebar />

        {/* Toggle Button Inside Sidebar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-1 rounded-full border-2 border-background flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ChevronLeft size={16} />
        </button>
      </motion.aside>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-white p-3 rounded-r-full shadow-lg hover:pr-6 transition-all group"
          >
            <Menu
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </motion.button>
        )}
      </AnimatePresence>
      <motion.main
        animate={{
          marginLeft: isLargeScreen && isOpen ? "300px" : "0px",
          width: isLargeScreen && isOpen ? "calc(100% - 300px)" : "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 min-h-screen overflow-auto"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </motion.main>
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
