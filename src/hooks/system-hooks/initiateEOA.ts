import { ethers } from "ethers";
import { setItemInStorage, getCoinBalance } from "../../utils/helper";

export function initiateEOA(
  credentialId: any,
  setSigner: any,
  rpc: string,
  setProvider: any,
  setEOA: any,
  setBalance: any,
) {
  return () => {
    if (!credentialId) {
      return;
    }

    const inputBytes = ethers.utils.toUtf8Bytes(credentialId);
    const hash = ethers.utils.keccak256(inputBytes);

    const mnemonic = ethers.utils.entropyToMnemonic(hash);
    const eoa = ethers.Wallet.fromMnemonic(mnemonic);

    setItemInStorage("signer", eoa.address);

    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const signer = eoa.connect(provider);
    setSigner(signer);
    setProvider(provider);
    setEOA(eoa.address);

    getCoinBalance(eoa.address, provider, setBalance);
  };
}
