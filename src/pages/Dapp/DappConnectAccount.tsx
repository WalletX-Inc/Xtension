import StepHeader from "./StepHeader";
import { getShortDisplayString } from "../../utils/helper";
import { Eye } from "react-feather";

function DappConnectAccount() {
  const smartAddress = localStorage.getItem("smartAccount");

  return (
    <div className="container mt-3">
      <StepHeader completedSteps={[1, 2]} />
      <a
        href="https://www.walletx.info/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center mb-4"
      >
        <span className=" mt-2 rounded-t-3xl bg-gray-700 underline mb-4  py-3 px-6 font-medium">
          www.walletx.info
        </span>{" "}
      </a>
      <h2 className="text-2xl font-bold text-center ">
        Connect to Account 1 <br />
        {getShortDisplayString(smartAddress)}
      </h2>
      <p className="text-base text-center mb-5"> Allow this site to:</p>

      <div className="max-w-[78%] mx-auto m-3 py-3 p-4 mb-5 flex justify-between bg-gray-700 rounded-full">
        <Eye className="mr-3" />
        <span className="text-lg">
          Send address,account balance,activity and suggest transactions to
          approve{" "}
        </span>
      </div>
      <h2 className="text-lg text-center mb-2 mt-[80px] ">
        Only connect with the sites you trust.
        <span className="text-blue-500 ml-1 cursor-pointer">Learn more</span>
      </h2>
      <hr className="my-1 mx-6 text-gray-700" />
      <div className="flex justify-center mt-8">
        <button className="w-36 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-4">
          Cancel
        </button>
        <button
          className="w-36 text-white bg-gray-700 hover:bg-gray-600 rounded-lg flex justify-center m-auto
          transition duration-500 hover:scale-110 p-2"
        >
          Connect
        </button>
      </div>
    </div>
  );
}

export default DappConnectAccount;
