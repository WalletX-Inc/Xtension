import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { RecoilRoot } from "recoil";
import { Toaster } from "react-hot-toast";

function App() {
  return (
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
  );
}

export default App;
