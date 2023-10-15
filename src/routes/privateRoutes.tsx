import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { PrivateLayout} from "../pages/Layout/PrivateLayout";
import ConfigProvider from "../context/ConfigProvider";
import AddAddresses from "../pages/Transaction/AddAddress";

function PrivateRoutes() {
  return (
    <ConfigProvider>
      <Routes>
        <Route element={<PrivateLayout />} >
          <Route index element={<Dashboard />} />
          <Route path= "/dashboard/transaction/add-address" element={<AddAddresses/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default PrivateRoutes;
