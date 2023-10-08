import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
