import { ChevronRight } from "react-feather";
import icon128 from "../../assets/icons/mainLogo.png";
import StepHeader from "./StepHeader";

export default function DappConnecting() {
  return (
    <div className="container mt-3">
      <StepHeader completedSteps={[1, 2, 3]} />
      <div className="mx-auto flex items-center justify-center h-96">
        <div className="flex-col justify-center items-center gap-4">
          <h3 className="text-xl mb-3 text-center">Connecting...</h3>
          <div className="flex justify-center ">
            <img
              src={icon128}
              alt="WalletX"
              className="m-auto w-20 bg-gray-500 rounded-xl "
            />
            <span className="m-auto text-gray-500">----------</span>

            <ChevronRight className=" bg-gray-700 rounded-full m-auto" />
            <span className="m-auto text-gray-500">----------</span>

            <img
              src={icon128}
              alt="WalletX"
              className="m-auto w-20 bg-gray-500 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
