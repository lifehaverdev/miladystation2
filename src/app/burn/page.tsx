'use client'
import Link from "next/link";
import { FC, useEffect, useMemo, useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
//import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
//import { SolanaLogo, Loader } from "components";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletConnectWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
//import styles from "./index.module.css";
import Header from '../../components/header'
import Socials from '../../components/socials'

//import { Metaplex } from "@metaplex-foundation/js";
//import { getTokensMetadata } from "utils/getTokensMetadata";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
require('@solana/wallet-adapter-react-ui/styles.css');

const knownTokenMintAddress = 'AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg'

const BurnSPLView: React.FC = ({}) => {


const Wallet: FC = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                        <WalletMultiButton />
                        <BurnMS2/>
                    </div>
                </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

  

  return (
    <>
    <Header />
    <div className="h-screen w-80">
    <Wallet />
    </div>
    <Socials />
    </>
  );
};

const getTokenAccountByMint = async (connection: any, publickey: PublicKey, mintAddress: string) => {
    try {
        const response = await connection.getTokenAccountsByOwner(
            publickey,
            {
                mint: new PublicKey(mintAddress),
            },
            "processed"
        );

        if (response.value.length === 0) {
            throw new Error("No token account found for the specified mint address.");
        }

        return response.value[0]; // Return the first matching token account
    } catch (error) {
        console.error("Error fetching token account by mint:", error);
        throw error;
    }
};


const BurnMS2 = () => {
    const { connection } = useConnection();

    const wallet = useWallet();
    const publickey = wallet.publicKey;
    //const metaplex = new Metaplex(connection);
    const [userSPL, setUserSPL] = useState<any | null>(null);
    //const [isFetched, setIsFetched] = useState<boolean>(false);
    const [isBurning, setIsBurning] = useState<boolean>(false);
    const [currentTx, setCurrentTx] = useState<number | null>(null);
    const [totalTx, setTotalTx] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    //const [toBurn, setToBurn] = useState<any>([]);

    // const copyToClipboard = (text:string) => {
    //     navigator.clipboard.writeText(text).then(() => {
    //         alert('Copied to clipboard!');
    //     }, (err) => {
    //         console.error('Could not copy text: ', err);
    //     });
    // };

    return (
        <>
        <div>
            <button
                className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
                onClick={useCallback( async ()=>{
                    try {
                        if (publickey) {
                            setIsBurning(true);
                            setSuccess(false);
                            setMessage("");
                
                            // Fetch the user's token account address for the known token
                            //const tokenAccountInfo = await getTokenAccountByMint(connection, publickey, knownTokenMintAddress);
                            const tokenAccountAddress = new PublicKey('5ETXU6D1Vk6VumLUKeoH2uVEFKV5QZpDj4ksQ2kLYgCX')//new PublicKey(tokenAccountInfo.pubkey.toBase58());
                            // const userTokenAccount = splAccounts.find(
                            // (accountInfo) =>
                            //     accountInfo.account.data.parsed.info.mint === knownTokenMintAddress &&
                            //     accountInfo.account.data.parsed.info.tokenAmount.uiAmount > 0
                            // );
                
                            if (!tokenAccountAddress) {
                            setIsBurning(false);
                            setMessage("No tokens found to burn.");
                            return;
                            }
                
                            const ms2 = new PublicKey(knownTokenMintAddress)
                            
                            //const tokenAmount = userTokenAccount.account.data.parsed.info.tokenAmount.amount;
                            const amount = 1000000;
                
                            let Tx = new Transaction();
                
                            const burnInstruction = Token.createBurnInstruction(
                                TOKEN_PROGRAM_ID,
                                ms2,
                                tokenAccountAddress,
                                publickey,
                                [],
                                amount
                            );
                
                            Tx.add(burnInstruction);
                
                            const signature = await wallet.sendTransaction(Tx, connection);
                            const confirmed = await connection.confirmTransaction(
                                signature,
                                "processed"
                            );
                            console.log("confirmation", signature);
                            
                            //setToBurn([]);
                            setIsBurning(false);
                            setSuccess(true);
                        } else {
                            setMessage("Please connect your wallet first!");
                            setSuccess(false);
                        }
                
                    } catch (error) {
                      setIsBurning(false);
                      console.log(error);
                    }
                },[connection, publickey, wallet])}
                disabled={!publickey}
            >
                Burn
            </button>
            </div>
            <div>
            {/* {showHash && (
                <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold leading-6 text-gray-900">Verify your account</h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>reply with the copied hash to the bot</p>
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
            )} */}
        </div>
        </>
    );
};

export default BurnSPLView