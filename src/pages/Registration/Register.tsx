import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { client } from "@passwordless-id/webauthn";
import { v4 as uuidv4 } from "uuid";
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
  // State declarations
  const [deviceName, setDeviceName] = useState("");
  const [signer, setSigner] = useState(null);

  // Hooks for navigation and authentication
  const navigate = useNavigate();
  const { login } = useAuth();
  const { init } = useConfig();

  // Retrieving smart account address and devices data from local storage
  const smartAccountAddress = getItemFromStorage("smartAccount");

  // Effect to handle signer setup
  useEffect(() => {
    if (signer) {
      getSmartWalletAddress();
    }
  }, [signer]);

  // Effect to navigate to dashboard after account creation
  useEffect(() => {
    if (smartAccountAddress) {
      navigate(`/dashboard`);
      toast.success("Account Created Successfully!", {
        icon: "🚀",
        duration: 3000,
      });
      login();
    }
  }, [smartAccountAddress, login, navigate]);

  // Handler for device name input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(event.target.value);
  };

  // Function to handle device registration
  const registerDevice = async () => {
    if (!deviceName) {
      toast.error("Please enter a device name.");
      return;
    }

    try {
      const challenge = uuidv4();
      const registration = await client.register(deviceName, challenge, {
        authenticatorType: "both",
        userVerification: "required",
        timeout: 60000,
        attestation: false,
        debug: false,
      });

      if (registration) {
        const deviceData = {
          hashCode: generateSHA256Hash(deviceName),
          name: deviceName,
          id: registration.credential.id,
        };
        setItemInStorage("isLoggedIn", true);
        generateEOA(registration.credential.id, deviceData);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  // Function to generate an Externally Owned Account (EOA)
  const generateEOA = (credentialId, deviceData) => {
    const inputBytes = ethers.utils.toUtf8Bytes(credentialId);
    const hash = ethers.utils.keccak256(inputBytes);
    const mnemonic = ethers.utils.entropyToMnemonic(hash);
    const eoa = ethers.Wallet.fromMnemonic(mnemonic);

    const provider = new ethers.providers.JsonRpcProvider(Config.RPC_MUMBAI);
    const newSigner = eoa.connect(provider);

    setSigner(newSigner);
    updateDevicesStorage(deviceData, eoa.address);
  };

  // Function to update devices data in storage
  const updateDevicesStorage = (deviceData, address) => {
    const allDevicesData = getItemFromStorage("devices") || [];
    setItemInStorage('devices', [{ ...deviceData, signer: address }, ...allDevicesData]);
  };

  // Function to initialize smart wallet address
  const getSmartWalletAddress = async () => {
    try {
      await init(80001, deviceName); // Replaced hardcoded chainId with value directly
    } catch (error) {
      toast.error("Failed to initialize wallet.");
    }
  };

  // JSX for the Register component
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-top gap-10">
        <div className="h-1/2 min-w-[75%]  flex flex-col items-center justify-center text-lg mt-[60px]">
          <Input
            type="text"
            placeholder="Enter a Unique Username"
            onChange={handleInputChange}
          />
          <Button onClick={registerDevice}>Register</Button>
          <Link to={"/login"}>Already Have an account? Login</Link>
        </div>
        <div className="absolute bottom-2 underline underline-offset-4 decoration-sky-600/30">
          <p>Non-custodial biometric wallet</p>
        </div>
      </div>
    </>
  );
};

export default Register;
