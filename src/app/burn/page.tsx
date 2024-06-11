'use client'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

import Link from "next/link";
import { FC, Fragment, useEffect, useMemo, useState, useCallback } from "react";
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

const options = [
    { id: 1, name: 'Custom Lora Training', amount: 1000000, type: 'exact'},
    { id: 2, name: 'Groupchat Admin Mode', amount: 1000000, type: 'minimum'},
    { id: 3, name: 'stationthisbot Clone', amount: 5000000, type: 'exact'}
]

function classNames(...classes:string[]) {
    return classes.filter(Boolean).join(' ')
  }

 function Dropdown() {
    const [selected, setSelected] = useState(options[0])
  
    return (
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="block truncate">{selected.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
  
              <Transition show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((person) => (
                    <Listbox.Option
                      key={person.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : '',
                          !active ? 'text-gray-900' : '',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                            {person.name}
                          </span>
  
                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    )
  }


 function Form() {
    return (
      <form>
        <div className="">
          <div>
            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label className="block text-sm font-medium leading-6 text-blue-900 sm:pt-1.5">
                  Project Name
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="project"
                    id="project"
                    className="block w-full rounded-md border-0 py-1.5 text-blue-900 shadow-sm ring-1 ring-inset ring-blue-300 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label className="block text-sm font-medium leading-6 text-blue-900 sm:pt-1.5">
                  Twitter Handle
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="twitter"
                    id="twitter"
                    className="block w-full rounded-md border-0 py-1.5 text-blue-900 shadow-sm ring-1 ring-inset ring-blue-300 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label className="block text-sm font-medium leading-6 text-blue-900 sm:pt-1.5">
                  Telegram Handle
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    id="telegram"
                    name="telegram"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-blue-900 shadow-sm ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

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
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-2">
                        {/* <div className="flex flex-col items-center transform translate-x-1/2"> */}
                            <br></br>
                            <br></br>
                            <br></br>
                            <WalletMultiButton />
                            <Dropdown />
                            <Form />
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
                {isBurning ? 'Burning...' : `Burn MS2`}
            </button>
        </div>
        <div>
            {message && <p>{message}</p>}
        </div>
        </>
    );
};

export default BurnSPLView