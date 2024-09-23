import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

const cookies = new Cookies();

export const PublicRouter = ({ children }) => {
  const isAuthenticated = cookies.get("rupyzToken");

  if (!isAuthenticated) {
    return children;
  }

  return <Navigate to="/web" />;
};
