// "use client"

// import React, { FC, useMemo, useCallback, useState } from 'react';
// import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// import { WalletConnectWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
// import {
//     WalletModalProvider,
//     WalletDisconnectButton,
//     WalletMultiButton
// } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl,
//     Connection,
//     PublicKey,
//     Keypair,
//     Transaction,
//     SystemProgram
//  } from '@solana/web3.js';

// //   import {
// //     burnChecked,
// //     createBurnCheckedInstruction,
// //     TOKEN_PROGRAM_ID,
// //   } from "@solana/spl-token";


// import {Token} from "@solana/spl-token";


// import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import Header from '../../components/header'
// import Socials from '../../components/socials'
// import CryptoJS from 'crypto-js';
// import {salt} from './_salt';

// // Default styles that can be overridden by your app
// require('@solana/wallet-adapter-react-ui/styles.css');

// const Verify: React.FC = () => {
//     return (
//         <>
//         <Header/>
//         <div className="h-screen">
//         <Wallet/>
//         </div>
//         <Socials/>
//         </>
//       );
// }

// const Wallet: FC = () => {
//     // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
//     const network = WalletAdapterNetwork.Devnet;
    
//     // You can also provide a custom RPC endpoint.
//     const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    
//     const wallets = useMemo(
//         () => [
//             new PhantomWalletAdapter(),
//         ],
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         [network]
//     );

//     return (
//         <ConnectionProvider endpoint={endpoint}>
//             <WalletProvider wallets={wallets} autoConnect>
//                 <WalletModalProvider>
//                 <div className="flex items-center justify-center min-h-screen">
//                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
//                         <WalletMultiButton />
//                         <BurnMS2 />
//                     </div>
//                 </div>
//                 </WalletModalProvider>
//             </WalletProvider>
//         </ConnectionProvider>
//     );
// };

// const BurnMS2: FC = () => {
    
//     const { publicKey, signTransaction } = useWallet();
//     const [showHash, setShowHash] = useState(false);

//     const burnMS2 = useCallback(async () => {
//         if (!publicKey) throw new Error('Wallet not connected');
//         const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
//         const token = new Token(connection, new PublicKey("AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg"), new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), payerKeyPair);
//         const payer = publicKey;
//         const account = publicKey;
//         const mint = "AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg"// specify the token mint
//         const owner = publicKey// specify the owner of the token
//         const amount = 1000// specify the amount of tokens to burn

//         try {
//             // Construct the burn transaction
//             const transaction = new Transaction().add(
//                 token.burn(connection,payer,account,mint,owner,amount)
//             );
            
//             //await connection.getSignatureStatus(signature);
//             // Sign the transaction
//             const signedTransaction = signTransaction ? await signTransaction(transaction) : null;
//             // Send the transaction to the network
//             const signature = signedTransaction ? await connection.sendRawTransaction(signedTransaction.serialize()) : null;
//             console.log('Transaction signature:', signature);
//             setShowHash(true);
//         } catch (error) {
//             console.error('Error burning tokens:', error);
//         }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [Connection, publicKey, signTransaction]);

//     return (
//         <>
//             <button
//                 type="button"
//                 className="rounded-full my-5 bg-mony px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mony focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mony"
//                 onClick={burnMS2}
//                 disabled={!publicKey}
//             >
//                 Burn MS2
//             </button>
//             {showHash && (
//                 <div className="bg-white shadow sm:rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="sm:flex sm:items-start sm:justify-between">
//                     <div>
//                       <h3 className="text-base font-semibold leading-6 text-gray-900">Transaction successful</h3>
//                       <div className="mt-2 max-w-xl text-sm text-gray-500">
//                         <p>Transaction for burning tokens was successful.</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//         </>
//     );
// };

// export default BurnMS2;
