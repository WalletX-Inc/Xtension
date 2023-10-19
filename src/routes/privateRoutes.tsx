import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { PrivateLayout} from "../pages/Layout/PrivateLayout";
import AddAddresses from "../pages/Transaction/AddAddress";
import AddTokens from "../pages/Transaction/AddToken";
import ApproveTransaction from "../pages/Transaction/ApproveTransaction";

function PrivateRoutes() {

  return (
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
          element={<ApproveTransaction/>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default PrivateRoutes;
