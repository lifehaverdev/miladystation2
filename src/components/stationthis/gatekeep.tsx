import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

interface WalletGatekeeperProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuth: boolean) => void;
    children: (publicKey: string) => React.ReactNode; // Children as a function to pass publicKey
}

const WalletGatekeeper: React.FC<WalletGatekeeperProps> = ({ isAuthenticated, setIsAuthenticated, children }) => {
    const { publicKey, signMessage, connected } = useWallet(); // Access wallet connection
    
    const [message, setMessage] = useState<string | null>(null); // Message for displaying status
    const [storedPublicKey, setStoredPublicKey] = useState<string | null>(null); // State to hold the stored publicKey
    //console.log('publicKey in wallet gatekeeper', publicKey, connected);

    // Check if publicKey exists in localStorage on mount
    useEffect(() => {
        const storedKey = localStorage.getItem('publicKey');
        if (storedKey) {
            setStoredPublicKey(storedKey);
            setIsAuthenticated(true); // Set as authenticated if the publicKey is stored
        }
    }, [setIsAuthenticated]);

    // Ensure the button is enabled when a wallet is connected and publicKey is available
    useEffect(() => {
        if (connected && publicKey) {
            setStoredPublicKey(publicKey.toBase58()); // Store publicKey
        }
    }, [connected, publicKey]);

    const handleSignatureFlow = useCallback(async () => {
        if (!publicKey) {
            setMessage('Wallet not connected');
            return;
        }
        const message = "I will use this wallet to create on StationThisBot, I am the owner";
        const encodedMessage = new TextEncoder().encode(message);

        const timestamp = Math.floor(Date.now() / 60000); // Current time in minutes

        try {
            const signature = signMessage ? await signMessage(encodedMessage) : null;
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

                // Store the publicKey and token in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('publicKey', publicKey.toBase58());

                setStoredPublicKey(publicKey.toBase58()); // Update the publicKey in state
                setIsAuthenticated(true); // Mark user as authenticated
                setMessage('Wallet confirmed! You now have access to the content.');
            } else {
                const errorData = await confirmResponse.json();
                setMessage('Error confirming wallet: ' + errorData.error);
            }
        } catch (error: any) {
            setMessage('Error: ' + error.message);
        }
    }, [publicKey, signMessage, setIsAuthenticated]);

    // If the user is authenticated, render the child components
    if (isAuthenticated && storedPublicKey) {
        return <>{children(storedPublicKey)}</>; // Pass publicKey to children
    }

    // If not authenticated, render the wallet connection button
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                <WalletMultiButton/>
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
            </div>
        </>
    );
};

export default WalletGatekeeper;
