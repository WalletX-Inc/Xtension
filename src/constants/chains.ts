const supportedChains = [
    {
        name: 'Polygon Mainnet',
        chainId: 137,
        rpc: 'https://polygon-rpc.com',
        nativeAsset: 'MATIC',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
        paymasterUrl: 'https://paymaster.biconomy.io/api/v1/80001/UYATlrlJ9.d1efbad1-1158-4156-ae07-324726431f69',
        isMainnet: true,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: true,
    },
    {
        name: 'Arbitrum One Mainnet',
        chainId: 42161,
        rpc: 'https://arbitrum-one.publicnode.com',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Arbitrum Nova Mainnet',
        chainId: 42170,
        rpc: 'https://nova.arbitrum.io/rpc',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Polygon ZKEVM Mainnet',
        chainId: 1101,
        rpc: 'https://zkevm-rpc.com',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'BSC Mainnet',
        chainId: 56,
        rpc: 'https://bsc.publicnode.com',
        nativeAsset: 'BNB',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Optimism Mainnet',
        chainId: 10,
        rpc: 'https://mainnet.optimism.io',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Avalanche Mainnet',
        chainId: 43114,
        rpc: 'https://api.avax.network/ext/bc/C/rpc',
        nativeAsset: 'AVAX',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Base Mainnet',
        chainId: 8453,
        rpc: 'https://developer-access-mainnet.base.org',
        nativeAsset: 'ETH',
        chainUri: 'https://pbs.twimg.com/profile_images/1632431836096782338/W-9qsu1e_400x400.jpg',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Moon Beam Mainnet',
        chainId: 1284,
        rpc: 'https://rpc.api.moonbeam.network',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Linea Mainnet',
        chainId: 59144,
        rpc: 'https://linea-mainnet.infura.io/v3/8af40d61a66047ca8294a0bb43b958fa',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27657.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Mantle Mainnet',
        chainId: 5000,
        rpc: 'https://rpc.mantle.xyz',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'opBNB Mainnet',
        chainId: 204,
        rpc: 'https://opbnb-mainnet-rpc.bnbchain.org',
        nativeAsset: 'BNB',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: true,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Ethereum',
        chainId: 1,
        rpc: 'https://eth-mainnet.g.alchemy.com/v2/1OaFf_GaHEiIq39PFKVk7QTTLTBvgp_R',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: 'https://bundler.biconomy.io/api/v2/1/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
        paymasterUrl: 'https://paymaster.biconomy.io/api/v1/1/4nUU0EmQ6.2c5c625b-dc68-4ad4-8d05-0e7a399590fd',
        isMainnet: true,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: true,
    },
    {
        name: 'Ethereum Goerli',
        chainId: 5,
        rpc: 'https://eth-goerli.biconomy.io',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: 'https://bundler.biconomy.io/api/v2/5/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
        paymasterUrl: 'https://paymaster.biconomy.io/api/v1/5/rjhoCQp58.3c5dc789-ff1e-445c-a60d-fb7b2ecc6bd9',
        isMainnet: false,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: true,
    },
    {
        name: 'Polygon Mumbai',
        chainId: 80001,
        rpc: 'https://polygon-mumbai.g.alchemy.com/v2/7JwWhWSG1vtw6ggm_o_GcYnyNw02oM8b',
        nativeAsset: 'MATIC',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
        paymasterUrl: 'https://paymaster.biconomy.io/api/v1/80001/UYATlrlJ9.d1efbad1-1158-4156-ae07-324726431f69',
        isMainnet: false,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: true,
    },
    {
        name: 'BSC Testnet',
        chainId: 97,
        rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        nativeAsset: 'BNB',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Polygon ZKEVM Testnet',
        chainId: 1442,
        rpc: 'https://rpc.public.zkevm-test.net',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Arbitrum Goerli Testnet',
        chainId: 421613,
        rpc: 'https://goerli-rollup.arbitrum.io/rpc',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Optimism Goerli Testnet',
        chainId: 420,
        rpc: 'https://goerli.optimism.io',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Avalanche Testnet',
        chainId: 43113,
        rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
        nativeAsset: 'AVAX',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: false,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Base Goerli Testnet',
        chainId: 84531,
        rpc: 'https://goerli.base.org',
        nativeAsset: 'ETH',
        chainUri: 'https://pbs.twimg.com/profile_images/1632431836096782338/W-9qsu1e_400x400.jpg',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Linea Testnet',
        chainId: 59140,
        rpc: 'https://rpc.goerli.linea.build',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27657.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Moonbase Alpha Testnet',
        chainId: 1287,
        rpc: 'https://rpc.testnet.moonbeam.network',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Mantle Testnet',
        chainId: 5001,
        rpc: 'https://rpc.testnet.mantle.xyz',
        nativeAsset: 'ETH',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
    {
        name: 'Optimism Binance Testnet',
        chainId: 5611,
        rpc: 'https://opbnb-testnet-rpc.bnbchain.org',
        nativeAsset: 'BNB',
        chainUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
        coinUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        bundlerUrl: '',
        paymasterUrl: '',
        isMainnet: false,
        isL2: true,
        isERC20GasPaymentSupported: true,
        isEnabled: false,
    },
]

export default supportedChains;