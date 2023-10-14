import logoIcon from "../../assets/icons/icon16.png";

function Dashboard() {
  return (
    <>
      <div className=" text-white mt-24 min-h-[210px]">
        <div className="flex justify-center mb-7">
          <img className="w-7 h-7 rounder mr-3" src={logoIcon} alt="address" />
          <h2 className="text-2xl font-bold">
            0x123333...23
          </h2>
        </div>
        <h3 className="text-center text-3xl font-extrabold">20 ETH</h3>
      </div>
    </>
  );
}

export default Dashboard;
