import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import { getItemFromStorage } from "../utils/helper";
import localforage from "localforage";
import DappInteraction from "../pages/DappInteraction";

function PrivateRoutes() {
  const navigate = useNavigate();

  const devices = getItemFromStorage("devices");

  // Clear the local storage if you get the error 
  useEffect(() => {
    if (devices.length <= 0) {
      console.log("Clear all data from local storage");
      localforage.clear();
      localStorage.clear();
      navigate("/login");
    }
  }, [devices.length]);

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
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* This is an temporary route and should be removed */}
      <Route path="dappinteraction" element={<DappInteraction />} />
    </Routes>
  );
}

export default PrivateRoutes;
