import { ethers } from "ethers";
import { setItemInStorage } from "../../utils/helper";
import { useGetBalance } from "../functional-hooks/useGetBalance";

export function initiateEOA(credentialId: any, setSigner: any, rpc: string, setProvider: any, setEOA: any, setBalance: any) {
  return () => {
    if (!credentialId) {
      console.log("[Hooks] No credentialId");
      return;
    }

    const inputBytes = ethers.utils.toUtf8Bytes(credentialId);
    const hash = ethers.utils.keccak256(inputBytes);

    const mnemonic = ethers.utils.entropyToMnemonic(hash);
    const eoa = ethers.Wallet.fromMnemonic(mnemonic);

    setItemInStorage("signer", eoa.address);

    console.log("[Hooks] EOA : ", eoa.address);

    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const signer = eoa.connect(provider);
    setSigner(signer);
    setProvider(provider);
    setEOA(eoa.address);

    useGetBalance(provider, eoa.address, setBalance);
  }  
}