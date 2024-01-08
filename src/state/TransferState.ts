import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

type transferData = {
  uid: string;
  name: string;
  address: string;
  tokenName: string | undefined;
  tokenSymbol: string | undefined;
  tokenAddress: string | undefined;
  tokenDecimal: number | string;
  tokenBalance: number | undefined;
  tokenLogo: string;
  amount: number;
};

// eslint-disable-next-line import/prefer-default-export
export const transferState = atom<transferData[]>({
  key: "transferState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
