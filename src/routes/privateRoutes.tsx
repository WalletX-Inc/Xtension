import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default PrivateRoutes;
