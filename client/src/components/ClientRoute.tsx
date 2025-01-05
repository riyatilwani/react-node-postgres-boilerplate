import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ClientRouteProps {
  children: JSX.Element;
}

const ClientRoute = ({ children }: ClientRouteProps): JSX.Element => {
  const { isAuth, user } = useAppSelector((state) => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />; // Redirect admins away from client routes
  }

  return children;
};

export default ClientRoute;
