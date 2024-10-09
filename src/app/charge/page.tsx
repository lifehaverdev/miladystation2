'use client'

import { FC, useState } from 'react';
import Header from '@/components/header';
import Socials from '@/components/socials';
import MobileWarning from '@/components/mobileWarn';
import TxAlert from '@/components/txAlert';
import Dropdown from '@/components/charge/Dropdown';
import SwapForm from '@/components/charge/SwapForm';
import PayDev from '@/components/charge/PayDev';
import Status from '@/components/charge/Status';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
//import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';


require('@solana/wallet-adapter-react-ui/styles.css');

const options = [
  { id: 1, name: 'User Points', amount: 0, type: 'minimum'},
  { id: 2, name: 'Group Points', amount: 0, type: 'minimum'},
]

const PaySolView: FC = () => {
  const [selectedService, setSelectedService] = useState(options[0]);
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
                <MobileWarning />
                <Status progress={progress} />
                <WalletMultiButton />
                <TxAlert message={message} onClose={closeTxError} success={success} />
                <div className="w-100 bg-black text-white p-6 rounded-md sm:w-4/5 md:w-4/5">
                  <SwapForm selectedService={selectedService} setSelectedService={setSelectedService}/>
                  <PayDev setSuccess={setSuccess} setMessage={setMessage} setProgress={setProgress} selectedService={selectedService} />
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

export default PaySolView;
