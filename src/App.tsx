import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";
import { AuthProvider } from "./hooks/system-hooks/useAuth";
import { RecoilRoot } from "recoil";
import { Toaster } from "react-hot-toast";
import ConfigProvider from "./context/ConfigProvider";
import Moralis from 'moralis';
import { useEffect } from "react";
import dotenv from "dotenv";

function App() {

  useEffect(() => {
    Moralis.start({
    apiKey: process.env.REACT_APP_MORALIS_NFT_API,
  });

  }, []);

  return (
    <ConfigProvider>
      <BrowserRouter>
        <AuthProvider>
          <RecoilRoot>
            <AppRoutes />
            <Toaster
              toastOptions={{
                style: {
                  border: "1px solid white",
                  color: "white",
                  background: "#030712",
                },
              }}
            />
          </RecoilRoot>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
