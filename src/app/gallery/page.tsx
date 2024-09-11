"use client"

import React, { FC, useMemo, useCallback, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '../../components/header';
import Socials from '../../components/socials';

import Gallery from '@/components/stationthis/gallery'

// Default styles for the wallet button
require('@solana/wallet-adapter-react-ui/styles.css');

const Verify: FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

    // Conditionally render the Workspace component if the user is authenticated
    if (isAuthenticated) {
        return <Gallery publicKey = {PublicKey}/>;
    }

    return (
        <>
        <Header/>
        <div className="h-screen">
        <WalletComponent setIsAuthenticated={setIsAuthenticated} /> {/* Pass the setter to WalletComponent */}
        </div>
        <Socials/>
        </>
    );
}


const WalletComponent: FC<{ setIsAuthenticated: (isAuth: boolean) => void }> = ({ setIsAuthenticated }) => {
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
                            <SignatureFlow setIsAuthenticated={setIsAuthenticated} /> {/* Pass the setter to SignatureFlow */}
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

// Single button to sign, generate hash, and confirm wallet
const SignatureFlow: FC<{ setIsAuthenticated: (isAuth: boolean) => void }> = ({ setIsAuthenticated }) => {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');
    //const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state


    const handleSignatureFlow = useCallback(async () => {
        if (!publicKey) {
            setMessage('Wallet not connected');
            return;
        }
        const message = "I will use this wallet to create on StationThisBot, I am the owner";
        const encodedMessage = new TextEncoder().encode(message);
        

        try {
            // Step 1: Generate the hash by calling the createHash API route
            const signature = signMessage ? await signMessage(encodedMessage) : null;
            const timestamp = Math.floor(Date.now() / 60000); // Current time in minutes
            const hashResponse = await fetch('/api/createHash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicKey: publicKey.toBase58(),
                    timestamp,
                }),
            });

            if (!hashResponse.ok) {
                const errorData = await hashResponse.json();
                setMessage('Error generating hash: ' + errorData.error);
                return;
            }

            const { hash } = await hashResponse.json(); // Extract the generated hash
            console.log('Generated Hash:', hash);

            // Step 2: Immediately confirm the wallet by calling the confirmWallet API route
            const confirmResponse = await fetch('/api/walletConfirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicKey: publicKey.toBase58(),
                    timestamp,
                    clientHash: hash, // Use the generated hash for wallet confirmation
                }),
            });

            if (confirmResponse.ok) {
                const data = await confirmResponse.json();
                console.log('data',data)// Store the token in localStorage (or use cookies if needed)
                localStorage.setItem('authToken', data.token);

                setMessage('Wallet confirmed! You now have access to gated content.');
                setIsAuthenticated(true); // Set authentication state to true
            } else {
                const errorData = await confirmResponse.json();
                setMessage('Error confirming wallet: ' + errorData.error);
            }
        } catch (error:any) {
            setMessage('Error: ' + error.message);
        }
    }, [signMessage, publicKey, setIsAuthenticated]);

    return (
        <>
            <div>
                <button
                    type="button"
                    className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
                    onClick={handleSignatureFlow}
                    disabled={!publicKey}
                >
                    Sign and Confirm Wallet
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
