import { Outlet, Navigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";

const PrivateRoute = () => {
  const { loggedIn, loading } = useAuthStatus();

  if (loading) {
    return <h3 className="text-red-600 font-bold">Loading...</h3>;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in/" />;
};

export default PrivateRoute;
