import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function ProtectedRoute({ children }) {
  const [cookies] = useCookies(["session_meta"]);
  const token = cookies.session_meta;
  const location = useLocation();

  if (!token) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  return children;
}
