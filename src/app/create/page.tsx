'use client'

import React, { useState, useMemo } from 'react';
import WalletGatekeeper from '@/components/stationthis/gatekeep';
import Workspace from '@/components/stationthis/workspace'; // Import Workspace component
import Header from '@/components/header';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles for the wallet button
require('@solana/wallet-adapter-react-ui/styles.css');

const Workbench: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <>
            <Header />
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        {/* WalletGatekeeper now inside the Wallet context providers */}
                        <WalletGatekeeper isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
                            {(publicKey) => (
                                <>
                                <Workspace publicKey={publicKey} /> {/* Pass publicKey to Workspace */}
                                </>
                            )}
                        </WalletGatekeeper>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </>
    );
};

export default Workbench;