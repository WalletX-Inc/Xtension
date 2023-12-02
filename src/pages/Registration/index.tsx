import { useState } from "react";
import { ArrowRightCircle } from "react-feather";
import Button from "../../components/common/Button";
import icon128 from "../../assets/icons/mainLogo.png";
import Register from "./Register";
import { removeItemFromStorage } from "../../utils/helper";

function Registration() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      <img src={icon128} alt="logo" className="w-40  h-36 m-auto mt-12" />
      <h1 className="font-bold  text-center text-2xl m-auto">Wallet X</h1>

      {showRegister ? (
        <Register />
      ) : (
        <Button
          className="min-w-[300px] mt-[150px] text-white bg-gray-900 hover:bg-gray-600 rounded-3xl flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2"
          onClick={() => {
            setShowRegister(true);
            removeItemFromStorage("smartAccount");
          }}
        >
          <div className="p-2 flex justify-between items-center gap-5 font-bold">
            Create new wallet <ArrowRightCircle />{" "}
          </div>
        </Button>
      )}
    </div>
  );
}

export default Registration;
