import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoutes = () => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <LoadingSpinner />;
  if (!isCheckingAuth && !user) return <Navigate replace={true} to="/login" />;
  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoutes;
