"use client"

import React, { FC, useMemo, useCallback, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '../../components/header';
import Socials from '../../components/socials';
import CryptoJS from 'crypto-js';

require('@solana/wallet-adapter-react-ui/styles.css');

const Verify: FC = () => {
    return (
        <>
        <Header/>
        <div className="h-screen">
        <WalletComponent/>
        </div>
        <Socials/>
        </>
      );
}

const WalletComponent: FC = () => {
    const network = WalletAdapterNetwork.Mainnet; // Using mainnet for Solana
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                            <WalletMultiButton />
                            <SignWithWallet />
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const SignWithWallet = () => {
    const { publicKey } = useWallet();
    const [message, setMessage] = useState('');

    const handleVerify = useCallback(async () => {
        if (!publicKey) {
            setMessage('Wallet not connected');
            return;
        }

        const timestamp = Math.floor(Date.now() / 60000); // Current time in minutes
        const saltedMessage = publicKey.toBase58() + timestamp + salt; // Combine publicKey, timestamp, and salt
        console.log('publicKey', publicKey.toBase58(), 'timestamp', timestamp)
        // Create the client-side hash
        const clientHash = CryptoJS.SHA256(saltedMessage).toString();
        console.log(clientHash)
        try {
            // Send publicKey, timestamp, and clientHash to your API route
            const response = await fetch('/api/walletConfirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicKey: publicKey.toBase58(),
                    timestamp,
                    clientHash,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Verification successful! Token: ' + data.token);
            } else {
                const errorData = await response.json();
                setMessage('Verification failed: ' + errorData.error);
            }
        } catch (error:any) {
            setMessage('Error during verification: ' + error.message);
        }
    }, [publicKey]);

    return (
        <>
            <div>
                <button
                    type="button"
                    className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
                    onClick={handleVerify}
                    disabled={!publicKey}
                >
                    Verify Wallet
                </button>
            </div>
            <div>
                {message && (
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <p>{message}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Verify;
