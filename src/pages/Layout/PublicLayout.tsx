import { Outlet } from "react-router-dom";
import "./index.css";

function PublicLayout() {
  return (
    <div className="landing_wrapper w-screen h-screen relative text-white overflow-hidden">
      <div
        className=" content w-[360px] h-[600px] centered-element absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-grey-700 m-auto rounded-lg "
       style={{
        background:'url(icons/bgImage.jpeg) no-repeat'
       }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
