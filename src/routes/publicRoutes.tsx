import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import PublicLayout from "../pages/Layout/PublicLayout";

function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Login />} />
        <Route element={<LandingPage />} path="/landing" />
        <Route element={<Registration />} path="register" />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default PublicRoutes;
