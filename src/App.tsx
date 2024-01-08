import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";
import { AuthProvider } from "./hooks/system-hooks/useAuth";
import { RecoilRoot } from "recoil";
import { Toaster } from "react-hot-toast";
import ConfigProvider from "./context/ConfigProvider";
import Moralis from 'moralis';
import { useEffect } from "react";

function App() {

  useEffect(() => {
    Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImQ0MDk1OWVhLTBlYjktNGFjNy1hODE3LWM0OGRmNWZmOWVlZCIsIm9yZ0lkIjoiMzcwOTA4IiwidXNlcklkIjoiMzgxMTkxIiwidHlwZUlkIjoiNjdkZDYwNjItZWQ2Ny00YmM2LTliOTYtMWU2MDEzODFhMzA5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDQ0MjY5NTgsImV4cCI6NDg2MDE4Njk1OH0.HmVdDgJvlUbVMj8EfrQCtXyjbY9r8dVYCM8zyS1folw",
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
