/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { client } from "@passwordless-id/webauthn";
import { v4 } from "uuid";
import { ethers } from "ethers";
import { BiconomySmartAccount, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { Bundler } from '@biconomy/bundler';
import { BiconomyPaymaster } from '@biconomy/paymaster';

import Config from "../../config";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getItemFromStorage, setItemInStorage } from "../../utils/helper";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [buttonTitle, setButtonTitle] = useState<string>("Register");
  const navigate = useNavigate();
  const { login } = useAuth();
  console.log('login : ', { login });

  useEffect(() => {
    if (signer) {
      getSmartWalletAddress();
    }
  }, [signer]);

   function generateEOA(credentialId: any) {
    setButtonTitle("Loading...");
    const inputBytes = ethers.utils.toUtf8Bytes(credentialId);
    const hash = ethers.utils.keccak256(inputBytes);

    const mnemonic = ethers.utils.entropyToMnemonic(hash);
    const eoa = ethers.Wallet.fromMnemonic(mnemonic);

    setItemInStorage("signer", eoa.address);

    const provider = new ethers.providers.JsonRpcProvider(Config.RPC_MUMBAI);
    const signer =  eoa.connect(provider);
    setSigner(signer);
  }

  async function getSmartWalletAddress() {
    const bundler = new Bundler({ bundlerUrl: Config.BUNDLER_MUMBAI, chainId: Config.CHAINID_MUMBAI, entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS });
    const paymaster = new BiconomyPaymaster({ paymasterUrl: Config.PAYMASTER_MUMBAI });

    const smartAccountConfig: any = { signer, chainId: Config.CHAINID_MUMBAI, rpcUrl: Config.RPC_MUMBAI, bundler, paymaster };

    const account = new BiconomySmartAccount(smartAccountConfig);
    const smartAccount = await account.init();

    const smartAccountAddress = await smartAccount.getSmartAccountAddress();
    setItemInStorage("smartAccount", smartAccountAddress);
    setItemInStorage("network", "Polygon Mumbai (80001)");
    setItemInStorage("isLoggedIn", true);
    setButtonTitle("Done");
    login();
    toast.success("Account Created Successfully !", {
      icon: "🚀", // Custom icon
      duration: 3000, // Duration in milliseconds
    });
    navigate(`/dashboard`);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(event.target.value);
  };

  async function registerDevice() {
    const device = deviceName ? getItemFromStorage('device') : null;

    if (device.name) {
      alert(`${deviceName} is already registered. Please choose another name`);
      return;
    }

    const challenge = v4();

    const registration = deviceName ? 
      await client.register(deviceName, challenge, {
        authenticatorType: "both",
        userVerification: "required",
        timeout: 60000,
        attestation: false,
        debug: false,
      }) : null;

    if(deviceName && registration){
      setItemInStorage('device', { name: deviceName?.toString(), id: registration?.credential.id })
      setItemInStorage('isLoggedIn', true)
      generateEOA(registration?.credential.id);
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
            className="min-w-[300px] mt-[70px] text-white bg-gray-900 border hover:bg-gray-950 rounded-lg flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2 "
            onClick={registerDevice}
          >
            {buttonTitle}
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
