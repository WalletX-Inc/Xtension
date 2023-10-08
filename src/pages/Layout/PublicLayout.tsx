import { Outlet } from "react-router";
import "./index.css";

function PublicLayout() {
  return (
    <div className="landing_wrapper w-screen h-screen relative text-white">
      <div className="content w-[360px] h-[600px] centered-element absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-700 m-auto rounded-lg ">
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
