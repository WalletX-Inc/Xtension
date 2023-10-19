import { BiconomySmartAccount, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { Bundler } from '@biconomy/bundler';
import { BiconomyPaymaster } from '@biconomy/paymaster';
import { setItemInStorage } from "../../utils/helper";

export function initiateSmartWallet(rpcUrl: string, bundlerUrl: string, chainId: number, paymasterUrl: string, signer: any, login: any, setSmartAccountProvider: any, setSmartAccountAddress: any) {

  return async () => {
    if (!signer) {
      console.log("[Hooks] No signer");
      return;
    } 
 
    const bundler = new Bundler({ bundlerUrl:bundlerUrl, chainId, entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS });
    const paymaster = new BiconomyPaymaster({ paymasterUrl: paymasterUrl });

    const smartAccountConfig: any = { signer, chainId, rpcUrl, bundler, paymaster };

    const account = new BiconomySmartAccount(smartAccountConfig);
    const smartAccount = await account.init();

    const smartAccountAddress = await smartAccount.getSmartAccountAddress();

    console.log("[Hooks] Smart Account Address: ", smartAccountAddress);

    login()
    setItemInStorage("smartAccount", smartAccountAddress);
    setItemInStorage("network", chainId);
    setItemInStorage("isLoggedIn", true);
    setSmartAccountProvider(smartAccount);
    setSmartAccountAddress(smartAccountAddress);
  }
}
