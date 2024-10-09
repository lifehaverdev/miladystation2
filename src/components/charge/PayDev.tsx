import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useState, useCallback } from "react";
import { createChargeTransaction, submitTransaction, confirmTransaction } from "@/utils/txHelper";
import { PublicKey, Transaction } from "@solana/web3.js";

interface PayDevProps {
    setSuccess: (value: boolean) => void;
    setMessage: (value: string) => void;
    setProgress: (value: number) => void;
    selectedService: any; // To determine if it's a group transaction
  }

const PayDev: FC<PayDevProps> = ({ setSuccess, setMessage, setProgress, selectedService }) => {
  const { publicKey, signTransaction } = useWallet();
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const handlePayment = useCallback(async () => {
    if (!publicKey) {
      setMessage("Please connect your wallet first!");
      setSuccess(false);
      return;
    }

    try {
      setIsPaying(true);
      setSuccess(false);
      setMessage("");

      const solInput = document.getElementById('solInputAmount') as HTMLInputElement;
      const amount = parseFloat(solInput?.value);

      // Create charge transaction
      const tx = await createChargeTransaction(publicKey, amount);
      console.log('Transaction created:', tx);

      // Sign the transaction
      let signedTx: Transaction | undefined;
      if (signTransaction) {
        signedTx = await signTransaction(tx);
      }

      if (!signedTx) {
        throw new Error("Transaction signing failed.");
      }

      // Submit signed transaction
      const signedTxBase64 = signedTx.serialize().toString("base64");
      const submitData = await submitTransaction(signedTxBase64);
      console.log('Submitted transaction:', submitData.txSignature);

      setProgress(30);

      // Confirm transaction
      setTimeout(async () => {
        const confirmed = await confirmTransaction(submitData.txSignature);
        if (confirmed) {
          setProgress(60);
          setMessage(`Transaction successful: ${JSON.stringify(submitData)}`);
          setSuccess(true);

          // Save the transaction to the database
          await fetch('/api/saveCharge', {
            method: 'POST',
            body: JSON.stringify({
                wallet: publicKey.toBase58(),
                amount,
                hash: submitData.txSignature,
                group: selectedService.id === 2 ? true : null, // Attach group info if selected
              }),
            headers: { 'Content-Type': 'application/json' },
          });

          setProgress(100);
        } else {
          throw new Error("Transaction confirmation failed.");
        }
      }, 20000); // Wait to allow confirmation time

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setProgress(0);
      console.error(error);
    } finally {
      setIsPaying(false);
    }
  }, [publicKey, signTransaction, setProgress, setMessage, setSuccess, selectedService]);

  return (
    <>
      <div>
        <button
          className="mt-6 w-full bg-purple-600 py-2 text-white rounded hover:bg-purple-700 transition duration-300"
          onClick={handlePayment}
          disabled={!publicKey || isPaying}
        >
          {isPaying ? 'Charging...' : `Charge the Chat`}
        </button>
      </div>
    </>
  );
};

export default PayDev;
