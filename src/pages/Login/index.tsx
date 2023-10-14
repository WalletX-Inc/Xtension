import { useState } from "react";
import { toast } from "react-hot-toast";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import icon128 from "../../assets/icons/mainLogo.png";
import { Link } from "react-router-dom";

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
        <div className="h-1/2 min-w-[75%]  flex flex-col items-center justify-center text-lg mt-[60px]">
          <Input
            className="min-w-[300px] placeholder:text-sm placeholder:italic placeholder:text-slate-400 max-w-xs text-center rounded-lg mb-4 outline-none"
            type="text"
            id="name"
            name="name"
            placeholder="Enter the Registered Username"
            onChange={(e) => handleInputChange(e)}
          />
          <Button
            className="min-w-[300px] mt-[70px] text-white bg-gray-900 border hover:bg-gray-950 rounded-lg flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2"
            onClick={() => {
              toast.success("Login Successfully !", {
                icon: "🚀",
                duration: 3000,
                
              });
            }}
          >
            Login
          </Button>
          <Link
            className="mt-3 text-sm cursor-pointer"
            // onClick={() => {
            //   // chrome.tabs.query(
            //   //   { active: true, currentWindow: true },
            //   //   function (tabs) {
            //   //     window.open(`http://localhost:3000/register`);
            //   //   }
            //   // );
            //   /* global chrome */
            //   // window.open('/register','_blank')
            //   // chrome.browserAction.onClicked.addListener(function () {
            //   //   chrome.tabs.create({
            //   //     url: chrome.extension.getURL("index.html"),
            //   //     selected: true,
            //   //   });
            //   // });
            // }}
            to="/register"
          >
            Don't have an account ? Register
          </Link>
        </div>

        <div className="absolute bottom-2 underline underline-offset-4 decoration-sky-600/30">
          <p>Non-custodial biometric wallet</p>
        </div>
      </div>
    </>
  );
}

export default Login;
