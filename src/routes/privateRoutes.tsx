import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ConfigProvider from "../context/ConfigProvider";

function PrivateRoutes() {

  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default PrivateRoutes;
