import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { PrivateLayout} from "../pages/Layout/PrivateLayout";
import ConfigProvider from "../context/ConfigProvider";
import AddAddresses from "../pages/Transaction/AddAddress";
import AddTokens from "../pages/Transaction/AddToken";
import ApproveTransacton from "../pages/Transaction/ApproveTransaction";

function PrivateRoutes() {
  return (
    <ConfigProvider>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route
          path="/dashboard/transaction/add-address"
          element={<AddAddresses />}
        />
        <Route
          path="/dashboard/transaction/add-tokens"
          element={<AddTokens />}
        />
        <Route
          path="/dashboard/transaction/approve-transactions"
          element={<ApproveTransacton/>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default PrivateRoutes;
