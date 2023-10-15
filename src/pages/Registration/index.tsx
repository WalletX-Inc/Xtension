import { useState } from "react";
import Button from "../../components/common/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import icon128 from "../../assets/icons/mainLogo.png";
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
          className="min-w-[300px] mt-[150px] text-white bg-gray-900 border hover:bg-gray-950 rounded-3xl flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2"
          onClick={() => {
            setShowRegister(true);
          }}
        >
          <div className="p-2 flex justify-between items-center gap-5 font-bold">
            Create new wallet <AiOutlineArrowRight />{" "}
          </div>
        </Button>
      )}
    </div>
  );
}

export default Registration;
