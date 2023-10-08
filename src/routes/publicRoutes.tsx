import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";


function PublicRoutes() {
  return (
    <Routes>
       <Route path='/' element={<LandingPage/>} /> 
     
      <Route path="*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
}

export default PublicRoutes;
