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
        <div className="h-1/2 min-w-[75%]  flex flex-col items-center justify-center text-lg mt-12">
          <Input
            className="w-screen placeholder:text-sm placeholder:italic placeholder:text-slate-400 max-w-xs text-center text-black rounded-lg py-2 px-3 mb-4 outline-none"
            type="text"
            id="name"
            name="name"
            placeholder="Enter a Unique Username"
            onChange={(e) => handleInputChange(e)}
          />
          <Button
            className="min-w-[300px] mt-[70px] bg-blue-600 rounded-full flex justify-center m-auto
        transition duration-500 hover:scale-110 p-3 "
            onClick={() => {
              toast.success("Account Created Successfully !", {
                icon: "🚀", // Custom icon
                duration: 3000, // Duration in milliseconds
                style: {
                  marginTop: "70px",
                },
              });
            }}
          >
            Register
          </Button>
          <Link className="mt-3 text-sm" to={"/login"}>
            Already Have an account ? Login
          </Link>
        </div>

        <div className="absolute bottom-2">
          <p>Non-custodial biometric wallet</p>
        </div>
      </div>
    </>
  );
};

export default Register;
