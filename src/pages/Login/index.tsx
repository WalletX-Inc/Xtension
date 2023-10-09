import { useState } from "react";
import { toast } from "react-hot-toast";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import icon128 from "../../assets/icons/walletximage.png";

function Login() {
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(event.target.value);
  };
  return (
    <>
      <img src={icon128} alt="logo" className="w-40  h-36 m-auto mt-12" />
      <h1 className="font-bold  text-center text-2xl m-auto">Wallet X</h1>
      <div className="min-h-screen flex flex-col items-center justify-top gap-10">
        <div className="h-1/2 min-w-[75%]  flex flex-col items-center justify-center text-lg mt-12">
          <Input
            className="w-screen placeholder:text-sm placeholder:italic placeholder:text-slate-400 max-w-xs text-center text-black rounded-lg py-2 px-3 mb-4 outline-none"
            type="text"
            id="name"
            name="name"
            placeholder="Enter the Registered Username"
            onChange={(e) => handleInputChange(e)}
          />
          <Button
            className="min-w-[300px] mt-[70px] bg-blue-600 rounded-full flex justify-center m-auto
        transition duration-500 hover:scale-110 p-3"
            onClick={() => {
              toast.success("Login Successfully !", {
                icon: "🚀",
                duration: 3000,
                style: {
                  marginTop: "70px",
                },
              });
            }}
          >
            Login
          </Button>
          <div
            className="mt-3 text-sm cursor-pointer"
            onClick={() => {
              /* global chrome */
              chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs) {
                  window.open(`http://localhost:3000/register`);
                }
              );
             
            }}
          >
            Don't have an account ? Register
          </div>
        </div>

        <div className="absolute bottom-2">
          <p>Non-custodial biometric wallet</p>
        </div>
      </div>
    </>
  );
}

export default Login;
