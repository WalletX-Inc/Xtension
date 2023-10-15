import toast from "react-hot-toast";
import logoIcon from "../../assets/icons/icon16.png";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  async function sendTx() {
    console.log('sendTx');
    toast.success("Transaction Sent Successfully !", {
      icon: "🚀",
      duration: 3000,
    });
    navigate(`/dashboard/transaction/add-address`);
  }

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
        <button className="text-center text-sm font-bold underline" onClick={() => { sendTx() }}>Send</button>
      </div>
    </>
  );
}

export default Dashboard;
