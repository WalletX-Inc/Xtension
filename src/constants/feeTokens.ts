type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number | string;
  logoUri: string;
};

type FeeTokens = {
  [key: number]: Token[];
};

const feeTokens: FeeTokens = {
  137: [
    {
      name: "Wrapped MATIC",
      symbol: "WMATIC",
      address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      decimals: 18,
      logoUri: "https://polygonscan.com/token/images/wMatic_32.pn",
    },
    {
      name: "USD Tether",
      symbol: "USDT",
      address: "0xeabc4b91d9375796aa4f69cc764a4ab509080a58",
      decimals: "18",
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png",
    },
    {
      name: "USDC",
      symbol: "USDC",
      address: "0xda5289fcaaf71d52a80a254da614a192b693e977",
      decimals: 6,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png",
    },
    {
      name: "DAI",
      symbol: "DAI",
      address: "0x27a44456bedb94dbd59d0f0a14fe977c777fc5c3",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dai.png",
    },
    {
      name: "SAND",
      symbol: "SAND",
      address: "0xe03489d4e90b22c59c5e23d45dfd59fc0db8a025",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sand.png",
    },
  ],
  80001: [
    {
      name: "Wrapped MATIC",
      symbol: "WMATIC",
      address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      decimals: 18,
      logoUri: "https://polygonscan.com/token/images/wMatic_32.pn",
    },
    {
      name: "USD Tether",
      symbol: "USDT",
      address: "0xeabc4b91d9375796aa4f69cc764a4ab509080a58",
      decimals: "18",
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png",
    },
    {
      name: "USDC",
      symbol: "USDC",
      address: "0xda5289fcaaf71d52a80a254da614a192b693e977",
      decimals: 6,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png",
    },
    {
      name: "DAI",
      symbol: "DAI",
      address: "0x27a44456bedb94dbd59d0f0a14fe977c777fc5c3",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dai.png",
    },
    {
      name: "SAND",
      symbol: "SAND",
      address: "0xe03489d4e90b22c59c5e23d45dfd59fc0db8a025",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sand.png",
    },
  ],
  5: [
    {
      name: "Wrapped MATIC",
      symbol: "WMATIC",
      address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      decimals: 18,
      logoUri: "https://polygonscan.com/token/images/wMatic_32.pn",
    },
    {
      name: "USD Tether",
      symbol: "USDT",
      address: "0xeabc4b91d9375796aa4f69cc764a4ab509080a58",
      decimals: "18",
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png",
    },
    {
      name: "USDC",
      symbol: "USDC",
      address: "0xda5289fcaaf71d52a80a254da614a192b693e977",
      decimals: 6,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png",
    },
    {
      name: "DAI",
      symbol: "DAI",
      address: "0x27a44456bedb94dbd59d0f0a14fe977c777fc5c3",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dai.png",
    },
    {
      name: "SAND",
      symbol: "SAND",
      address: "0xe03489d4e90b22c59c5e23d45dfd59fc0db8a025",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sand.png",
    },
  ],
  1: [
    {
      name: "Wrapped MATIC",
      symbol: "WMATIC",
      address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      decimals: 18,
      logoUri: "https://polygonscan.com/token/images/wMatic_32.pn",
    },
    {
      name: "USD Tether",
      symbol: "USDT",
      address: "0xeabc4b91d9375796aa4f69cc764a4ab509080a58",
      decimals: "18",
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png",
    },
    {
      name: "USDC",
      symbol: "USDC",
      address: "0xda5289fcaaf71d52a80a254da614a192b693e977",
      decimals: 6,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png",
    },
    {
      name: "DAI",
      symbol: "DAI",
      address: "0x27a44456bedb94dbd59d0f0a14fe977c777fc5c3",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dai.png",
    },
    {
      name: "SAND",
      symbol: "SAND",
      address: "0xe03489d4e90b22c59c5e23d45dfd59fc0db8a025",
      decimals: 18,
      logoUri:
        "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sand.png",
    },
  ],
};

export default feeTokens;
