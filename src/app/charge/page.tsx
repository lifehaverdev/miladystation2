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

import createBalancedBar from '@/components/charge/pointsbar'
const POINTMULTI = 540;
const NOCOINERSTARTER = 199800;

const options = [
    { id: 1, name: 'User Points', amount: 0, type: 'minimum'},
    { id: 2, name: 'Group Points', amount: 100000, type: 'minimum'},
    { id: 3, name: 'Tip the Dev', amount: 100000, type: 'minimum'},
]


function classNames(...classes:string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const Dropdown = ({ selectedService, setSelectedService }: { selectedService: any, setSelectedService: (value: any) => void }) => {
  
    return (
      <Listbox value={selectedService} onChange={setSelectedService}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900"></Listbox.Label>
            {/* <br></br> */}
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

  interface SwapFormProps {
    children: React.ReactNode; // Accepting children elements
}



const SwapForm: React.FC<SwapFormProps> = ({ children }) => {
    const [cryptoAmount, setCryptoAmount] = useState(0);
    const [pointsAmount, setPointsAmount] = useState(0);
    const [pointsPerSol, setPointsPerSol] = useState<number>(0); 
    const [loading, setLoading] = useState(true); // Loading state
    const [userInfo, setUserInfo] = useState<any>(null); // User info state
    const [discounts, setDiscounts] = useState({
      ms2BalanceDiscount: 0,
      ms2BurnDiscount: 0,
      levelDiscount: 0,
  });  // Store calculated discounts;
    const [solPrice, setSolPrice] = useState<number>(160);
    const { publicKey } = useWallet()

    const calculateDiscounts = (userInfo: any) => {
      //console.log('we calculate discount')
      const { balance, burns, exp } = userInfo;
  
      // Discount based on MS2 balance (25% discount if balance >= 600,000)
      const ms2BalanceDiscount = balance >= 6000000 ? 25 : (balance / 600000) * 25;
  
      // Discount based on MS2 burned (25% discount if burned >= 300,000)
      const ms2BurnDiscount = burns >= 300000 ? 25 : (burns / 300000) * 25;
  
      // Discount based on user level (25% discount if level >= 100)
      const userLevel = Math.floor(Math.cbrt(exp));
      const levelDiscount = userLevel >= 100 ? 25 : (userLevel / 100) * 25;
      //console.log('calculated discounts',ms2BalanceDiscount,ms2BurnDiscount,levelDiscount)
      // Return the calculated discounts
      return {
          ms2BalanceDiscount: Math.min(ms2BalanceDiscount, 25),  // Ensure max 25%
          ms2BurnDiscount: Math.min(ms2BurnDiscount, 25),        // Ensure max 25%
          levelDiscount: Math.min(levelDiscount, 25),            // Ensure max 25%
      };
  };

  const calculatePointCost = (discounts: { ms2BalanceDiscount: number, ms2BurnDiscount: number, levelDiscount: number }) => {
    
    const baseCostPerPoint = 0.001284; // Base cost for the user with no discounts
    if(!discounts){
      console.log('NO DISCOUNTS FOUND')
      return baseCostPerPoint
    }
    // Calculate the total discount by summing the three discount types
    const totalDiscount = (discounts.ms2BalanceDiscount || 0) + (discounts.ms2BurnDiscount || 0) + (discounts.levelDiscount || 0);
    
    // Cap the total discount at 75% (if total discount exceeds 75)
    const effectiveDiscount = Math.min(totalDiscount, 75);
    console.log('effectiveDiscount',effectiveDiscount)
    // Calculate the final cost per point by applying the discount to the base cost
    const discountedCostPerPoint = baseCostPerPoint * (1 - effectiveDiscount / 100);
    console.log('discountedCostPerPoint',discountedCostPerPoint)
    // Return the final cost per point
    return discountedCostPerPoint;  // Format to 6 decimal places
};

// Function to calculate point cost and points per SOL
const calculatePointsPerSol = useCallback(() => {
  if (discounts && solPrice) {
    console.log('discounts',discounts)
      const pointCostInUSD = calculatePointCost(discounts);
      console.log('pointcostusd',pointCostInUSD)
      const pointsPerSolCalc = solPrice / pointCostInUSD; // SOL to point conversion
      console.log('points per sol in calculate points per sol' , pointsPerSolCalc)
      setPointsPerSol(pointsPerSolCalc);
  }
}, [discounts, solPrice]);

  
  const fetchUserData = useCallback(async () => {
    if (!publicKey) return;

    try {
        setLoading(true);

        // Fetch experience
        const expResponse = await fetch('/api/getUserStats', {
            method: 'POST',
            body: JSON.stringify({ publicKey: publicKey.toBase58() }),
            headers: { 'Content-Type': 'application/json' }
        });
        const { exp, points, doints, qoints } = await expResponse.json();

        // Fetch burns
        const burnsResponse = await fetch('/api/getUserBurns', {
            method: 'POST',
            body: JSON.stringify({ publicKey: publicKey.toBase58() }),
            headers: { 'Content-Type': 'application/json' }
        });
        const { totalBurn } = await burnsResponse.json();

        // Fetch balance
        const balanceResponse = await fetch('/api/getMS2Balance', {
            method: 'POST',
            body: JSON.stringify({ publicKey: publicKey.toBase58() }),
            headers: { 'Content-Type': 'application/json' }
        });
        const { balance } = await balanceResponse.json();
        const groupsResponse = await fetch(`/api/getGroups`, {
            method: 'POST',
            body: JSON.stringify({ publicKey: publicKey.toBase58() }),
            headers: { 'Content-Type': 'application/json' },
        });
        const groupsData = await groupsResponse.json()

        // Set the fetched user data into the state
        const fetchedUserInfo = {
            exp,
            burns: totalBurn,
            balance,
            points,
            doints,
            qoints,
            group: groupsData
        };
        console.log('fetchedUserInfo',fetchedUserInfo)
        const solPriceResponse = await fetch('https://api-v3.raydium.io/mint/price?mints=So11111111111111111111111111111111111111112')
        setUserInfo(fetchedUserInfo);
        const solData = await solPriceResponse.json()
        console.log('solPrice',solData.data['So11111111111111111111111111111111111111112'])
        setSolPrice(parseFloat(solData.data['So11111111111111111111111111111111111111112']))
        // Calculate the discounts
        const calculatedDiscounts = calculateDiscounts(fetchedUserInfo);
        console.log('calculatedDiscounts',calculatedDiscounts)
        setDiscounts(calculatedDiscounts);
        
        // Calculate the discounts and points per SOL
        calculatePointsPerSol();
        setLoading(false);
    } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [publicKey]);

// Trigger data fetch when wallet connects
useEffect(() => {
    if (publicKey) {
        fetchUserData();
    }
}, [publicKey, fetchUserData]);

useEffect(() => {
  if (userInfo && solPrice) {
      // Recalculate pointsPerSol based on the fetched user data and discounts
      const pointCostInUSD = calculatePointCost(discounts); // Use correct discount value
      const newPointsPerSol = solPrice / pointCostInUSD;
      setPointsPerSol(newPointsPerSol); // Update pointsPerSol based on user data and solPrice
  }
}, [userInfo, solPrice, discounts]);

useEffect(() => {
  if (cryptoAmount && pointsPerSol) {
      setPointsAmount(cryptoAmount * pointsPerSol); // Update points after pointsPerSol is updated
  }
}, [cryptoAmount, pointsPerSol]); // Trigger recalculation only when these values change


const handleCryptoAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const amount = parseFloat(event.target.value);
  setCryptoAmount(amount); // Simply update cryptoAmount, points will be calculated via useEffect
};



    return (
        <>
            <h1 className="text-2xl font-bold text-center">⚡️⚡️ Charge your ⭐️STB🕶️ Account ⚡️⚡️</h1>
            <h2 className="text-2xl font-bold text-center">with 1-time-use points</h2>
            {children}
            <br></br>
            {loading ? (
                  <div className="flex justify-center items-center h-full">
                      <div className="spinner-border animate-spin text-white inline-block w-8 h-8 border-4 rounded-full" role="status">
                          <span className="visually-hidden">Loading...</span>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-col text-white justify-center h-full text-left">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p><strong>MS2 Balance: </strong>{userInfo.balance}🎮</p>
                        <p style={{ color: 'green', textAlign: 'right' }}>
                            {discounts && discounts.ms2BalanceDiscount ? `-${discounts.ms2BalanceDiscount}% ` : ''}
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p><strong>MS2 Burned: </strong>{userInfo.burns || 0}🔥</p>
                        <p style={{ color: 'green', textAlign: 'right' }}>
                            {discounts && discounts.ms2BurnDiscount ? `-${discounts.ms2BurnDiscount}%` : ''}
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p><strong>Level: </strong>{Math.floor(Math.cbrt(userInfo.exp))}</p>
                        <p style={{ color: 'green', textAlign: 'right' }}>
                            {discounts && discounts.levelDiscount ? `-${discounts.levelDiscount}%` : ''}
                        </p>
                    </div>
                    {/* Level Progress Bar */}
                      <p><strong>EXP: </strong>{(() => {
                              const totalExp = userInfo.exp + userInfo.points;
                              const level = Math.floor(Math.cbrt(totalExp));
                              const nextLevel = (level + 1) ** 3;
                              const lastLevel = level ** 3;
                              const toLevelUpRatio = (totalExp - lastLevel) / (nextLevel - lastLevel);

                              let bars = '🟩';
                              for (let i = 0; i < 6; i++) {
                                  bars += i < toLevelUpRatio * 6 ? '🟩' : '⬜️';
                              }

                              return bars;
                          })()}</p>


                      {/* Points Progress Bar */}
                      <p><strong>Points: </strong>{createBalancedBar(
                            Math.floor((userInfo.balance + NOCOINERSTARTER) / POINTMULTI),
                            userInfo.points + userInfo.doints,
                            userInfo.qoints,
                            7
                            )}</p>
                      
                      <p>{userInfo.points + userInfo.doints}/{Math.floor((userInfo.balance + userInfo.burns*2 + NOCOINERSTARTER) / POINTMULTI)}{ userInfo.qoints + pointsAmount > 0 ? ` + ${userInfo.qoints + pointsAmount}` : ''}</p>
                  </div>
              )}
              <br></br>
              { discounts && discounts.ms2BalanceDiscount + discounts.ms2BurnDiscount + discounts.levelDiscount > 0 ? <><p style={{ color: 'green', textAlign: 'center' }}><strong>-{discounts.ms2BalanceDiscount + discounts.ms2BurnDiscount + discounts.levelDiscount}% DISCOUNT</strong></p></> : null }
              <br></br>
              {/* <h3 className={''}>Your rate: ${calculatePointCost(discounts)} / point </h3> */}
              <h3 className={''}>Your rate: {pointsPerSol} point / SOL</h3>
            <div className="mt-4">
                <label className="block mb-2 text-sm">Sell (Enter SOL amount):</label>
                <input
                    id='solInputAmount'
                    type="number"
                    value={cryptoAmount}
                    onChange={handleCryptoAmountChange}
                    className="w-full p-2 text-black"
                />
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-sm">Buy (Points you get):</label>
                <input
                    type="number"
                    value={pointsAmount}
                    disabled
                    className="w-full p-2 text-black bg-gray-200"
                />
            </div>
            {/* <button className="mt-6 w-full bg-purple-600 py-2 text-white rounded hover:bg-purple-700 transition duration-300"
            //onClick={PayDev({})}
            >
                Swap
            </button> */}
            <p className="mt-4 text-xs">stationthisbot stationthisbot stationthisbot</p>
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

const PayDev = ({ setSuccess, setMessage, setProgress }: { setSuccess: (value:boolean)=> void, setMessage: (value:string)=> void, setProgress: any}) => {

    const { publicKey, signTransaction } = useWallet();
    const [isPaying, setIsPaying] = useState<boolean>(false);

    return (
        <>
        <div>
            <button
                className="mt-6 w-full bg-purple-600 py-2 text-white rounded hover:bg-purple-700 transition duration-300 "
                onClick={useCallback( async ()=>{
                    try {
                        
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

                            const solInput = document.getElementById('solInputAmount') as HTMLInputElement;
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

  const PaySolView: React.FC = ({}) => {
    const [selectedService, setSelectedService] = useState(options[0]);
    //const [amount, setAmount] = useState(selectedService.amount);
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
                    
                    <div className="items-center justify-center min-h-screen">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-2 w-3/4">
                        {/* <div className="flex flex-col items-center transform translate-x-1/2"> */}
                            <br></br>
                            <br></br>
                            <br></br>
                            
                            <MobileWarning />
                            <Status progress={progress}/>
                            <WalletMultiButton />
                            
                            <TxAlert message={message} onClose={closeTxError} success={success}/>
                            
                            {/* <Form selectedService={selectedService} amount={amount} setAmount={setAmount} formData={formData} setFormData={setFormData} /> */}
                            <div className="w-100 bg-black text-white p-6 rounded-md sm:w-4/5 md:w-4/5">
                            <SwapForm>
                                  <Dropdown selectedService={selectedService} setSelectedService={setSelectedService} />
                              </SwapForm>
                            <PayDev setSuccess={setSuccess} setMessage={setMessage} setProgress={setProgress}/>
                            </div>
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

export default PaySolView