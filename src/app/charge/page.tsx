'use client'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, XCircleIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

import { FC, useEffect, useMemo, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
//import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
//import { SolanaLogo, Loader } from "components";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import Header from '@/components/header'
import Socials from '@/components/socials'
import MobileWarning from '@/components/mobileWarn'
import TxAlert from '@/components/txAlert'

require('@solana/wallet-adapter-react-ui/styles.css');

const options = [
    { id: 1, name: 'Charge your Group', amount: 100000, type: 'minimum'},
    { id: 2, name: 'Tip the Dev', amount: 100000, type: 'minimum'},
]

function classNames(...classes:string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const Dropdown = ({ selectedService, setSelectedService, amount, setAmount }: { selectedService: any, setSelectedService: (value: any) => void, amount: number, setAmount: (value: number) => void }) => {
    const [selected, setSelected] = useState(options[0])
  
    return (
      <Listbox value={selectedService} onChange={setSelectedService}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900"></Listbox.Label>
            <br></br>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="block truncate">{selectedService.name}</span>
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


 function Form({ selectedService, amount, setAmount }: { selectedService: any, amount: number, setAmount: (value: number) => void, formData: any, setFormData: (value: any) => void }) {
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log('it changed')
    //     setTimeout(()=>{},5000);
    //     setAmount(parseInt(e.target.value, 10));
    // };
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
              {selectedService.type === 'exact' && (
                    <div className="mt-4 flex mx-auto justify-center text-lg font-bold text-lg text-white cursor-pointer transition-colors duration-300">
                        $MS2 {selectedService.amount}
                    </div>
                )}

                {selectedService.type === 'minimum' && (
                    <div className="mt-4 flex mx-auto justify-center">
                        <label className="block text-lg text-white cursor-pointer transition-colors duration-300">
                            Amount Sol
                        </label>
                        <input
                            id='solInput'
                            type="text"
                            placeholder={JSON.stringify(amount)}
                            // onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:text-black"
                            // min={selectedService.amount}
                        />
                    </div>
                )}
            </div>
          </div>
        </div>
      </form>
    )
  }

const PaySolView: React.FC = ({}) => {
    const [selectedService, setSelectedService] = useState(options[0]);
    const [formData, setFormData] = useState({
        projectName: '',
        twitterHandle: '',
        telegramHandle: ''
    });
    const [amount, setAmount] = useState(selectedService.amount);
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const closeTxError = () => {
        setMessage('');
    };

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
                            
                            <MobileWarning />
                            <Status progress={progress}/>
                            <WalletMultiButton />
                            <TxAlert message={message} onClose={closeTxError} success={success}/>
                            <Dropdown selectedService={selectedService} setSelectedService={setSelectedService} amount={amount} setAmount={setAmount}/>
                            <Form selectedService={selectedService} amount={amount} setAmount={setAmount} formData={formData} setFormData={setFormData} />
                            <PayDev setSuccess={setSuccess} setMessage={setMessage} selectedService={selectedService} formData={formData} setFormData={setFormData} setProgress={setProgress}/>
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

const PayDev = ({ setSuccess, setMessage, selectedService, formData, setProgress, setFormData }: { setSuccess: (value:boolean)=> void, setMessage: (value:string)=> void, selectedService: any, formData: any, setProgress: any, setFormData:any }) => {

    const { publicKey, signTransaction } = useWallet();
    const [isPaying, setIsPaying] = useState<boolean>(false);

    return (
        <>
        <div>
            <button
                className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
                onClick={useCallback( async ()=>{
                    try {
                        const project = document.getElementById('project') as HTMLInputElement;
                        const twitter = document.getElementById('twitter') as HTMLInputElement;
                        const telegram = document.getElementById('telegram') as HTMLInputElement;
                        if (publicKey) {
                            setIsPaying(true);
                            setSuccess(false);
                            setMessage("");
                            /*
                            // Fetch the user's token account address for the known token
                            const tokenAccountInfo = await fetchTokenAccount(`${publicKey}`);
                            console.log('here is the token account',tokenAccountInfo)
                            const tokenAccountAddress = new PublicKey(tokenAccountInfo.pubkey);
                            

                            if (!tokenAccountAddress) {
                            setIsPaying(false);
                            setMessage("No tokens found to burn.");
                            return;
                            }
                            */

                            /*
                            let amount;
                            if(selectedService.type == 'exact'){
                                amount = selectedService.amount * 1000000;
                            } else if (selectedService.type == 'minimum' && document.getElementById('sol-amount')){
                                const solInput = document.getElementById('sol-amount') as HTMLInputElement;
                                amount = parseInt(solInput?.value) * 1000000;
                            }
                            */

                            const solInput = document.getElementById('solInput') as HTMLInputElement;
                            const amount = parseFloat(solInput?.value);
                            
                            /*
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
                              */

                              console.log('solInput before create charge tx',amount);
                            let response = await fetch("/api/createChargeTx",
                                {
                                    method: "POST",
                                    body: JSON.stringify({
                                      publicKey: publicKey,//.toBase58(),
                                      amount: amount,
                                      //type: "token",
                                      //tokenAddress: tokenAccountAddress
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
                            const submitResponse = await fetch("/api/submitTx", {
                                method: "POST",
                                body: JSON.stringify({ signedTx: signedTxBase64 }),
                                headers: { "Content-type": "application/json; charset=UTF-8" },
                            });

                            // setFormData({
                            //     projectName: project.value,
                            //     twitterHandle: twitter.value,
                            //     telegramHandle: telegram.value,
                            // })
                            setProgress(30);
                            console.log('submitresponse',submitResponse)
                            var submitData = await submitResponse.json();
                            if (!submitResponse.ok) {
                                throw new Error(submitData.error);
                            }
                            console.log('submitData',submitData)
                            console.log('submitted sig',submitData.txSignature)
                            setTimeout(()=>{
                                console.log('we just waited')
                            },20000) //to give confirmation extra time to kick in
                            const confirmationResponse = await fetch("/api/confirmTx",
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
                                setProgress(60);
                                setMessage(`Transaction successful: ${JSON.stringify(submitData)}`);
                                setIsPaying(false);
                                setSuccess(true);
                                
                                
                                // Save the burn data to the database
                                await fetch('/api/saveCharge', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        wallet: publicKey,//.toBase58(),
                                        amount: amount,
                                        //service: selectedService.name,
                                        projectName: project.value,
                                        twitterHandle: twitter.value,
                                        telegramHandle: telegram.value,
                                        hash: submitData.txSignature,
                                    }),
                                    headers: { 'Content-Type': 'application/json' },
                                });
                                setProgress(100);
                              } else {
                                setMessage(`Transaction failed: ${submitData}`);

                                setIsPaying(false);
                                setSuccess(false);
                                setProgress(0);
                              }
                            
                        } else {
                            setMessage("Please connect your wallet first!");
                            setSuccess(false);
                        }
                
                    } catch (error:any) {
                      setIsPaying(false);
                      setMessage(`Error: ${error.message}`);
                      setProgress(0);
                      console.log(error);
                    }
                },[publicKey, signTransaction, setProgress, setMessage, setSuccess])}
                disabled={!publicKey}
            >
                {isPaying ? 'Charging...' : `Charge the Chat`}
            </button>
        </div>
        {/* <div>
            {message && <p>{message}</p>}
        </div> */}
        </>
    );
};

// const PayDev = ({ setSuccess, setMessage, selectedService, formData, setProgress, setFormData }: {{ setSuccess: (value:boolean)=> void, setMessage: (value:string)=> void, selectedService: any, formData: any, setProgress: any, setFormData:any }) => {
// }

function Status({ progress }: { progress: number }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (progress > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, [progress]);

    const handleClose = () => {
        setIsVisible(false);
    };
  
    return (
      <div className="relative">
        <div className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
          <span>Solutions</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </div>
  
        {isVisible && (
          <Transition
            show={isVisible}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
              <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  <h1>Do not leave the page</h1>
                </div>
                <Progress progress={progress} />
                <div className="flex-auto m-5">
                {progress === 100 && (
                                    <button
                                        onClick={handleClose}
                                        className="mt-4 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Close
                                    </button>
                                )}
                </div>
              </div>
            </div>
          </Transition>
        )}
      </div>
    );
  }


function Progress({ progress }: { progress: number }) {
    return (
        <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="">
          <h4 className="sr-only">Status</h4>
          <p className="text-sm font-medium text-gray-900">Processing Transaction</p>
          <div className="mt-6" aria-hidden="true">
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 flex justify-between text-sm font-medium text-gray-600">
              <div className={`flex-1 text-center ${progress >= 30 ? 'text-indigo-600' : ''}`}>Confirming Transaction</div>
              <div className={`flex-1 text-center ${progress >= 60 ? 'text-indigo-600' : ''}`}>Saving Data</div>
              <div className={`flex-1 text-right ${progress >= 90 ? 'text-indigo-600' : ''}`}>Complete</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default PaySolView