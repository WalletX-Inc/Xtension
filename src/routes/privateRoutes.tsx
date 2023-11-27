import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { PrivateLayout } from "../pages/Layout/PrivateLayout";
import AddAddresses from "../pages/Transaction/AddAddress";
import AddTokens from "../pages/Transaction/AddToken";
import ApproveTransaction from "../pages/Transaction/ApproveTransaction";
import Collectables from "../pages/Collectables";
import Activity from "../pages/Activity";
import Settings from "../pages/Settings";
import Bridge from "../pages/TransactDrawer/Bridge";
import Swap from "../pages/TransactDrawer/Swap";
import Receive from "../pages/TransactDrawer/Receive";
import SignMessage from "../pages/Dapp/SignMessage"

function PrivateRoutes() {
  return (
    <Routes>
      <Route element={<PrivateLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard/collectables" element={<Collectables />} />
        <Route path="/dashboard/activity" element={<Activity />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>

      <Route path="/dashboard/receive" element={<Receive />} />
      <Route path="/dashboard/bridge" element={<Bridge />} />
      <Route path="/dashboard/swap" element={<Swap />} />

      <Route
        path="/dashboard/transaction/add-address"
        element={<AddAddresses />}
      />
      <Route path="/dashboard/transaction/add-tokens" element={<AddTokens />} />

      <Route
        path="/dashboard/transaction/approve-transactions"
        element={<ApproveTransaction />}
      />

      <Route
        path="/dashboard/dapp/sign-message"
        element={<SignMessage/>}
      />
        
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default PrivateRoutes;
