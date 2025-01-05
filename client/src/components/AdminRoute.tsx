import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: AdminRouteProps): JSX.Element => {
  const { isAuth, user } = useAppSelector((state) => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />; // Redirect to home or an Unauthorized page
  }

  return children;
};

export default AdminRoute;