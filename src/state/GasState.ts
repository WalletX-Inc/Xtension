import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

type gasState = {
  tokenUID: string; //it is for looping and other tasks
  tokenLogo: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenBalance: number;
  tokenGas: number;
  tokenGasValue: number;
};

export const gasState = atom<gasState[]>({
  key: "GasState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
