import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { client } from "@passwordless-id/webauthn";
import { v4 } from "uuid";

import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/system-hooks/useAuth";
import { getItemFromStorage, log, setItemInStorage } from "../../utils/helper";
import icon128 from "../../assets/icons/mainLogo.png";
import Select from "../../components/common/Select";

function Login() {
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (val: any) => {
    setDeviceName(val);
  };

  const devicesFromStorage = getItemFromStorage("devices");

  const allDevices = useMemo(() => {
    if (devicesFromStorage) {
      const resultedOption = devicesFromStorage.map((d: any) => ({
        ...d,
        label: d?.name,
        value: d?.name,
      }));

      return resultedOption;
    }

    return [];
  }, [devicesFromStorage]);

  async function authenticateDevice() {
    if (deviceName) {
      try {
        const filterDevice = allDevices.filter(
          (d: any) => d.name === deviceName,
        )?.[0];

        const challenge = v4();

        const authentication = await client.authenticate(
          [filterDevice?.id],
          challenge,
          {
            authenticatorType: "both",
            userVerification: "required",
            timeout: 60000,
          },
        );

        if (filterDevice?.address) {
          setItemInStorage("smartAccount", filterDevice.address);
        } else {
          toast.error("Some error Occurred !");
        }

        if (authentication.credentialId) {
          login();
          setItemInStorage("isLoggedIn", true);
          toast.success("Login Successful !", {
            icon: "🚀",
            duration: 3000,
          });
          navigate(`/dashboard`);
        }
      } catch (err) {
        log("Error at login - authenticateDevice()", err, "error");
        toast.error("Something went wrong!", {
          duration: 3000, // Duration in milliseconds
        });
      }
    } else {
      toast.error("Please select an option !", {
        duration: 3000, // Duration in milliseconds
      });
    }
  }

  return (
    <>
      <img src={icon128} alt="logo" className="w-40  h-36 m-auto mt-12" />
      <h1 className="font-bold  text-center text-2xl m-auto">Wallet X</h1>
      <div className="min-h-screen flex flex-col items-center justify-top gap-10">
        <div className="h-1/2 min-w-[75%]  flex flex-col items-center justify-center text-lg mt-[60px]">
          {/* <Input
            className="min-w-[300px] placeholder:text-sm placeholder:italic placeholder:text-slate-400 max-w-xs text-center rounded-lg mb-4 outline-none"
            type="text"
            id="name"
            name="name"
            placeholder="Enter the Registered Username"
            onChange={(e) => handleInputChange(e)}
          /> */}
          <Select
            label="Select name"
            options={allDevices || []}
            onChange={handleInputChange}
          />
          <Button
            className="min-w-[300px] mt-[70px] text-white bg-gray-900 hover:bg-gray-600 rounded-lg flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2"
            onClick={authenticateDevice}
          >
            Login
          </Button>
          <Link className="mt-3 text-sm cursor-pointer" to="/register">
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
