/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { client } from "@passwordless-id/webauthn";
import { v4 } from "uuid";
import { ethers } from "ethers";

import Config from "../../config";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  getItemFromStorage,
  setItemInStorage,
  generateSHA256Hash,
} from "../../utils/helper";
import { useAuth } from "../../hooks/system-hooks/useAuth";
import { useConfig } from "../../context/ConfigProvider";

const Register = () => {
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [buttonTitle, setButtonTitle] = useState<string>("Register");
  const [defaultChainId] = useState<number>(80001);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { init } = useConfig();
  const smartAccountAddress = getItemFromStorage("smartAccount");
        const allDevicesData = getItemFromStorage("devices");

  useEffect(() => {
    if (signer) {
      getSmartWalletAddress();
    }
  }, [signer]);

  useEffect(() => {
    if (smartAccountAddress) {
      setButtonTitle("Done");
      login();
      toast.success("Account Created Successfully !", {
        icon: "🚀", // Custom icon
        duration: 3000, // Duration in milliseconds
      });
      navigate(`/dashboard`);
    }
  }, [smartAccountAddress]);

  function generateEOA(credentialId: any,data:any) {
    setButtonTitle("Registering...");
    const inputBytes = ethers.utils.toUtf8Bytes(credentialId);
    const hash = ethers.utils.keccak256(inputBytes);

    const mnemonic = ethers.utils.entropyToMnemonic(hash);
    const eoa = ethers.Wallet.fromMnemonic(mnemonic);

    const newData={
      ...data,
      signer:eoa.address
    }
    console.log("allDevicesData generateEOA", allDevicesData);
    if(allDevicesData){
      setItemInStorage('devices',[newData, ...allDevicesData]);
    }
    else{
      console.log('in else generateEOA ')
      setItemInStorage('devices',[newData])
    }
    // setItemInStorage("signer", eoa.address);

    const provider = new ethers.providers.JsonRpcProvider(Config.RPC_MUMBAI);
    const signer = eoa.connect(provider);
    //if device entered in storage
    
    setSigner(signer);
    console.log("signer execure");
  }

  async function getSmartWalletAddress() {
    await init(defaultChainId,deviceName);
    console.log("Register.jsx getSmartWalletAddress");
    // setButtonTitle("Done");
    // login();
    // toast.success("Account Created Successfully !", {
    //   icon: "🚀", // Custom icon
    //   duration: 3000, // Duration in milliseconds
    // });
    // navigate(`/dashboard`);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(event.target.value);
  };

  async function registerDevice() {
    // const device = deviceName
    //   ? getItemFromStorage(generateSHA256Hash("device"))
    //   : null;

    // if (device?.name === deviceName) {
    //   alert(`${deviceName} is already registered. Please choose another name`);
    //   return;
    // }

    const challenge = v4();

    const registration = deviceName
      ? await client.register(deviceName, challenge, {
          authenticatorType: "both",
          userVerification: "required",
          timeout: 60000,
          attestation: false,
          debug: false,
        })
      : null;
    console.log("deviceName ", deviceName, registration);
    if (deviceName && registration) {
      const deviceData = {
        hashCode: generateSHA256Hash(deviceName?.toString()),
        name: deviceName?.toString(),
        id: registration?.credential.id,
      };
      console.log(deviceData, "Register deviceData");
      // let allDevices = [deviceData];
      // if (allDevicesData) {
      //   allDevices = [deviceData, ...allDevicesData];
      // }
      // console.log(allDevices, allDevicesData, deviceData);
      // setItemInStorage("devices", allDevices);
      setItemInStorage("isLoggedIn", true);
      generateEOA(registration?.credential.id,deviceData);
    }
  }

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
            className="min-w-[300px] mt-[70px] text-white bg-gray-900 hover:bg-gray-600 rounded-lg flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2 "
            onClick={registerDevice}
          >
            {buttonTitle}
          </Button>
          <Link
            className={`mt-3 text-sm `}
            to={"/login"}
          >
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
