import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Register = () => {
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(event.target.value);
  };
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-top gap-10">
        <div className="h-1/2 min-w-[75%]  flex flex-col items-center justify-center text-lg mt-[60px]">
          <Input
            className="min-w-[300px] placeholder:text-sm placeholder:italic placeholder:text-slate-400 max-w-xs text-center rounded-lg mb-4 outline-none"
            type="text"
            id="name"
            name="name"
            placeholder="Enter a Unique Username"
            onChange={(e) => handleInputChange(e)}
          />
          <Button
            className="min-w-[300px] mt-[70px] text-white bg-gray-900 border hover:bg-gray-950 rounded-lg flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2 "
            onClick={() => {
              toast.success("Account Created Successfully !", {
                icon: "🚀", // Custom icon
                duration: 3000, // Duration in milliseconds
                
              });
            }}
          >
            Register
          </Button>
          <Link className="mt-3 text-sm" to={"/login"}>
            Already Have an account ? Login
          </Link>
        </div>

        <div className="absolute bottom-2 underline underline-offset-4 decoration-sky-600/30">
          <p>Non-custodial biometric wallet</p>
        </div>
      </div>
    </>
  );
};

export default Register;
