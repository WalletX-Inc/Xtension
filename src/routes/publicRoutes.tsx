import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import PublicLayout from "../pages/Layout/PublicLayout";
import { getItemFromStorage } from "../utils/helper";

const isRegistered = getItemFromStorage('smartAccount')

function PublicRoutes() {

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route element={!isRegistered ? <LandingPage /> : <Login />} path="/" />

        <Route element={<LandingPage />} path="/landing" />
        <Route element={<Registration />} path="register" />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default PublicRoutes;
