/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';

export default function useCoinBalance() {
    const [balance, setBalance] = useState(0);
    const [provider, setProvider] = useState(null);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        if (!provider) return;

        const updateBalance = async (provider: any) => {
            const blockNumber = await provider.getBlockNumber();
            const rawBalance = await provider.getBalance(address, blockNumber);
            setBalance(parseFloat(ethers.utils.formatEther(rawBalance)));
        };

        // provider && provider.on('block', updateBalance(provider));

        return () => {
            // provider.off('block', updateBalance(provider));
        };
    }, [address, provider]);

    async function getBalance(provider: any, address: any) {
        setProvider(provider);
        setAddress(address);
    }

return { balance, getBalance };
}