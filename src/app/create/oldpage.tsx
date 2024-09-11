'use client'

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SWRConfig } from "swr";

import { FC, useEffect, useMemo, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
//import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
//import { SolanaLogo, Loader } from "components";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import Header from '@/components/header'
import Socials from '@/components/socials'
import MobileWarning from '@/components/mobileWarn'
import TxAlert from '@/components/txAlert'

require('@solana/wallet-adapter-react-ui/styles.css');

export default function Home() {
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
            // <ConnectionProvider endpoint={endpoint}>
            //     <WalletProvider wallets={wallets} autoConnect>
            //         <WalletModalProvider>
                    <>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-2">
                        {/* <div className="flex flex-col items-center transform translate-x-1/2"> */}
                            <br></br>
                            <br></br>
                            <br></br>
                            
                            <MobileWarning />
                            {/* <Status progress={progress}/> */}
                            <WalletMultiButton />
                            {/* <TxAlert message={message} onClose={closeTxError} success={success}/> */}
                            {/* <Dropdown selectedService={selectedService} setSelectedService={setSelectedService} amount={amount} setAmount={setAmount}/> */}
                            {/* <Form selectedService={selectedService} amount={amount} setAmount={setAmount} formData={formData} setFormData={setFormData} /> */}
                            {/* <BurnMS2 setSuccess={setSuccess} setMessage={setMessage} selectedService={selectedService} formData={formData} setFormData={setFormData} setProgress={setProgress}/> */}
                        </div>
                    </div>
					</>
              
        );
    };
	return (
	<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					<Header />
					<div className="h-screen w-80">
					<Wallet />
					</div>
					<Socials />
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}