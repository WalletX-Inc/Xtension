type Token = {
    name: string;
    symbol: string;
    address: string;
    decimals: number | string;
    logoUri: string;
}

type Tokens = {
    [key: number]: Token[];
}

const tokens: Tokens = {
    1: [
        {
            name: 'Tether USD',
            symbol: 'USDT',
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            decimals: 6,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        },
        {
            name: 'USDC',
            symbol: 'USDC',
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            decimals: '6',
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        },
        {
            name: 'Dai Stablecoin',
            symbol: 'DAI',
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            decimals: 18,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        },
        {
            name: 'Wrapped Ether',
            symbol: 'WETH',
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png',
        }
    ],
    137: [
        {
            name: 'Tether USD',
            symbol: 'USDT',
            address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            decimals: 6,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        },
        {
            name: 'USDC',
            symbol: 'USDC',
            address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            decimals: '6',
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        },
        {
            name: 'Dai Stablecoin',
            symbol: 'DAI',
            address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            decimals: 18,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        },
        {
            name: 'Wrapped Matic',
            symbol: 'WMATIC',
            address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
            decimals: 18,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8925.png',
        }
    ],
    56: [
        {
            name: 'Tether USD',
            symbol: 'USDT',
            address: '0x55d398326f99059fF775485246999027B3197955',
            decimals: 18,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        },
        {
            name: 'USDC',
            symbol: 'USDC',
            address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            decimals: '18',
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        },
        {
            name: 'Dai Stablecoin',
            symbol: 'DAI',
            address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
            decimals: 18,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        },
        {
            name: 'Wrapped BNB',
            symbol: 'WBNB',
            address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            logoUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png',
        }
    ],
}

export default tokens;