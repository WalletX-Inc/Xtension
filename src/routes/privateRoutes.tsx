import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AddAddresses from "../pages/Transaction/AddAddress";

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path= "/dashboard/transaction/add-address" element={<AddAddresses/>}/>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default PrivateRoutes;
