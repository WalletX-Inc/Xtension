import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RecoilRoot>
          <AppRoutes />
        </RecoilRoot>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
