"use client"

import React, { FC, useMemo, useCallback, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletConnectWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import Header from '../../components/header'
import Socials from '../../components/socials'
import CryptoJS from 'crypto-js';
import {salt} from './_salt';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const Verify: React.FC = () => {
    return (
        <>
        <Header/>
        <div className="h-screen">
        <Wallet/>
        </div>
        <Socials/>
        </>
      );
}

const Wallet: FC = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/anza-xyz/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            
            //new UnsafeBurnerWalletAdapter(),
            // new WalletConnectWalletAdapter(),
            new PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                {/* <div className="flex items-center justify-center min-h-screen">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <WalletMultiButton />
                        <SignWithWallet />
                    </div>
                </div> */}
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
    const { publicKey, signMessage } = useWallet();
    const [hash, setHash] = useState('');
    const [showHash, setShowHash] = useState(false);

    const onClick = useCallback(async () => {
        if (!publicKey) throw new Error('Wallet not connected');

        const message = "I will use this wallet to create on StationThisBot, I am the owner";
        const encodedMessage = new TextEncoder().encode(message);

        try {
            const signature = signMessage ? await signMessage(encodedMessage) : null;
            const timestamp = Math.floor(Date.now() / 60000); // Current time in minutes
            const salted = salt; // This should be a secure, randomly generated value or constant
            console.log(publicKey.toBase58() + timestamp + salted);
            const generatedHash = CryptoJS.SHA256(publicKey.toBase58() + timestamp + salted).toString();

            setHash(generatedHash);
            setShowHash(true);  // Display hash and copy button
        } catch (error) {
            console.error('Error signing message: ', error);
        }
    }, [publicKey, signMessage]);

    const copyToClipboard = (text:string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <>
        <div>
            <button
                type="button"
                className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
                onClick={onClick}
                disabled={!publicKey}
            >
                Sign In
            </button>
            </div>
            <div>
            {showHash && (
                <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold leading-6 text-gray-900">Verify your account</h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Use the /verify command with the bot and reply with the copied hash</p>
                        <p>
                          {hash}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-mony px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => copyToClipboard(hash)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
        </>
    );
};

export default Verify