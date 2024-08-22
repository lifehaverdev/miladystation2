'use client'

// import { App } from "@/components/comfydeploy/App";
// import { Onboarding } from "@/components/comfydeploy/Onboarding";
// import { UserRuns } from "@/components/comfydeploy/UserRuns";
// import { Button } from "@/components/comfydeploy/ui/button";
// import { Skeleton } from "@/components/comfydeploy/ui/skeleton";
// import { getRuns } from "@/db/db";
//import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
				
					<div><h1>create</h1></div>
		{/* <main className="flex min-h-screen flex-col items-center">
			<nav className="fixed z-50 top-0 left-0 right-0 py-2 px-2 flex items-center justify-between w-full border-b bg-background">
				<div className="flex items-start justify-center">
					<div className="font-bold text-sm sm:text-base md:text-lg">ComfyUI Nextjs Demo</div>
				</div>
				<div className="flex items-start justify-center gap-2">
					<Button
						// variant="outline"
						className="rounded-xl h-fit px-4 py-1"
						asChild
					>
						<Link
							target="_blank"
							href="https://github.com/comfy-deploy/comfydeploy-fullstack-demo"
							className="flex gap-2 items-center"
						>
							GitHub
							<ExternalLink size={16} />
						</Link>
					</Button>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</nav>
			<div className="mt-[45px] w-full h-[calc(100vh-45px)] flex flex-col items-center space-x-2">
				<SignedOut>
					<Onboarding />
				</SignedOut>
				<SignedIn> 
					<div className="w-full md:mt-2 flex flex-col items-center justify-center gap-2">
						<App />
						<Suspense
							fallback={<Skeleton className="max-w-[800px] w-full h-[200px]" />}
						>
							<UserRunsAsync />
						</Suspense>
					</div>
				</SignedIn>
			</div>
		</main> */}
		</WalletModalProvider>
		</WalletProvider>
		</ConnectionProvider>
	);
}

// async function UserRunsAsync() {
// 	return (
// 		<SWRConfig
// 			value={{
// 				fallback: {
// 					userRuns: await getRuns(),
// 				},
// 			}}
// 		>
// 			<UserRuns />
// 		</SWRConfig>
// 	);
// }