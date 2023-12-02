import { Outlet } from "react-router-dom";
import BottomNavBar from "../../components/BottomNavBar";
import "./index.css";

const PrivateLayout = () => (
  <div className="landing_wrapper w-screen h-screen relative text-white overflow-hidden">
    <div className=" w-[360px] h-[600px] centered-element absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-grey-700 m-auto rounded-lg  ">
      <Outlet />
      <BottomNavBar />
    </div>
  </div>
);

export default PrivateLayout;
