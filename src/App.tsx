import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
