import PublicRoutes from "./publicRoutes";
import PrivateRoutes from "./privateRoutes";
import { useAuth } from "../hooks/useAuth";

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />;
}

export default AppRoutes;
