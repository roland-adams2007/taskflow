import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function PublicRoute({ children }) {
  const [cookies] = useCookies(["session_meta"]);
  const token = cookies.session_meta;
  const location = useLocation();

  if (token) {
    const redirectParam = new URLSearchParams(location.search).get("redirect");
    return <Navigate to={redirectParam ? decodeURIComponent(redirectParam) : "/dashboard"} replace />;
  }

  return children;
}
