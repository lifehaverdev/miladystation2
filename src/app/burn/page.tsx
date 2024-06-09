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
import Header from '../../components/header'
import Socials from '../../components/socials'

require('@solana/wallet-adapter-react-ui/styles.css');



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

const fetchTokenAccount = async (publicKey: string) => {
    try {
        const response = await fetch(`/api/getTokenAccount?publicKey=${publicKey}`);

        const data = await response.json();

        if (response.ok) {
            return data.tokenAccount;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error fetching token account:', error);
        throw error;
    }
};

const BurnMS2 = () => {
    const { connection } = useConnection();

    const { publicKey, signTransaction, connected } = useWallet();
    const [isBurning, setIsBurning] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    return (
        <>
        <div>
            <button
                className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
                onClick={useCallback( async ()=>{
                    try {
                        if (publicKey) {
                            setIsBurning(true);
                            setSuccess(false);
                            setMessage("");
                
                            // Fetch the user's token account address for the known token
                            const tokenAccountInfo = await fetchTokenAccount(`${publicKey}`);
                            console.log('here is the token account',tokenAccountInfo)
                            const tokenAccountAddress = new PublicKey(tokenAccountInfo.pubkey);
                
                            if (!tokenAccountAddress) {
                            setIsBurning(false);
                            setMessage("No tokens found to burn.");
                            return;
                            }
                            const amount = 1000000;
                            
                            let response = await fetch("/api/createBurnTx",
                                {
                                  method: "POST",
                                  body: JSON.stringify({
                                    publicKey: publicKey,//.toBase58(),
                                    amount: amount,
                                    type: "token",
                                    tokenAddress: tokenAccountAddress
                                  }),
                                  headers: { "Content-type": "application/json; charset=UTF-8" },
                                }
                              );
                            console.log(response);
                    
                              
                            const data = await response.json();
                            console.log(data)
                            if (!response.ok) {
                                console.log(response);
                                return
                            }
                            const tx = Transaction.from(Buffer.from(data.transactionBase64, "base64"));
                            console.log('tx',tx);
                            let signedTx;
                            if(signTransaction){
                                signedTx = await signTransaction(tx);
                            }
                            let signedTxBase64;
                            if(signedTx){
                                signedTxBase64 = signedTx.serialize().toString("base64");
                            }

                            // Send signed transaction
                            const submitResponse = await fetch("/api/submitBurnTx", {
                                method: "POST",
                                body: JSON.stringify({ signedTx: signedTxBase64 }),
                                headers: { "Content-type": "application/json; charset=UTF-8" },
                            });
                            console.log('submitresponse',submitResponse)
                            var submitData = await submitResponse.json();
                            if (!submitResponse.ok) {
                                throw new Error(submitData.error);
                            }
                            console.log('submitData',submitData)
                            console.log('submitted sig',submitData.txSignature)
                            const confirmationResponse = await fetch("/api/confirmBurnTx",
                                {
                                  method: "POST",
                                  body: JSON.stringify({ txSignature: submitData.txSignature }),
                                  headers: {
                                    "Content-type": "application/json; charset=UTF-8",
                                  },
                                }
                              );
                            console.log('confrimed',confirmationResponse)
                            const confirmationData = await confirmationResponse.json();
                            console.log(confirmationData)
                              if (confirmationData.confirmed) {
                                setMessage(`Transaction successful: ${submitData}`);
                                setIsBurning(false);
                                setSuccess(true);
                              } else {
                                setMessage(`Transaction failed: ${submitData}`);
                                setIsBurning(false);
                                setSuccess(false);
                              }
                            
                        } else {
                            setMessage("Please connect your wallet first!");
                            setSuccess(false);
                        }
                
                    } catch (error:any) {
                      setIsBurning(false);
                      setMessage(`Error: ${error.message}`);
                      console.log(error);
                    }
                },[publicKey, signTransaction])}
                disabled={!publicKey}
            >
                {isBurning ? 'Burning...' : 'Burn'}
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