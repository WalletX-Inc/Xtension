import { useState } from "react";
import Button from "../../components/common/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import icon128 from "../../assets/icons/walletximage.png";
import Register from "./Register";

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
          className="min-w-[300px] mt-[160px] bg-blue-600 rounded-full flex justify-center m-auto
        transition duration-500 hover:scale-110 "
          onClick={() => {
            setShowRegister(true);
          }}
        >
          <div className="p-3 flex justify-between items-center gap-5 font-bold">
            Create new wallet <AiOutlineArrowRight />{" "}
          </div>
        </Button>
      )}
    </div>
  );
}

export default Registration;
