import { Outlet } from "react-router-dom";
import Header from "../DashboardLayout/Header";
import Footer from "../DashboardLayout/Footer";
import "./index.css";

export const PrivateLayout = () => {
  return (
    <div className="landing_wrapper w-screen h-screen relative text-white overflow-hidden">
      <div className="border w-[360px] h-[600px] centered-element absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-grey-700 m-auto rounded-lg ">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

