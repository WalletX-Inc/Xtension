import { BiconomySmartAccount, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { Bundler } from '@biconomy/bundler';
import { BiconomyPaymaster } from '@biconomy/paymaster';
import { setItemInStorage } from "../utils/helper";

export function initiateSmartWallet(rpcUrl: string, bundlerUrl: string, chainId: number, paymasterUrl: string, signer: any, login: any, setSmartAccountProvider: any, setSmartAccountAddress: any) {

  return async () => {
    const bundler = new Bundler({ bundlerUrl:bundlerUrl, chainId, entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS });
    const paymaster = new BiconomyPaymaster({ paymasterUrl: paymasterUrl });

    const smartAccountConfig: any = { signer, chainId, rpcUrl, bundler, paymaster };

    const account = new BiconomySmartAccount(smartAccountConfig);
    const smartAccount = await account.init();

    const smartAccountAddress = await smartAccount.getSmartAccountAddress();
    login()
    setItemInStorage("smartAccount", smartAccountAddress);
    setItemInStorage("network", "Polygon Mumbai (80001)");
    setItemInStorage("isLoggedIn", true);
    setSmartAccountProvider(smartAccount);
    setSmartAccountAddress(smartAccountAddress);
  }
}
