import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicRoutes from "./publicRoutes";
import PrivateRoutes from "./privateRoutes";
import { useAuth } from "../hooks/system-hooks/useAuth";
import EthProvider from "../dapp-connection/js/services/EthProvider";

function AppRoutes() {
  const navigate = useNavigate();

  const redirectApp = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    EthProvider.init(redirectApp);
  });

  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />;
}

export default AppRoutes;
