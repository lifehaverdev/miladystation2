import { PublicKey, Transaction } from "@solana/web3.js";

// Function to create the transaction
export const createChargeTransaction = async (publicKey: PublicKey, amount: number) => {
  try {
    const response = await fetch("/api/createChargeTx", {
      method: "POST",
      body: JSON.stringify({ publicKey: publicKey.toBase58(), amount }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    if (!response.ok) {
      throw new Error(`Failed to create charge transaction: ${response.statusText}`);
    }

    const data = await response.json();
    const tx = Transaction.from(Buffer.from(data.transactionBase64, "base64"));
    return tx;
  } catch (error: any) {
    console.error(`[createChargeTransaction] Error: ${error.message}`);
    throw error;
  }
};

// Function to submit a signed transaction
export const submitTransaction = async (signedTxBase64: string) => {
  try {
    const response = await fetch("/api/submitTx", {
      method: "POST",
      body: JSON.stringify({ signedTx: signedTxBase64 }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to submit transaction: ${data.error || response.statusText}`);
    }

    return data;
  } catch (error: any) {
    console.error(`[submitTransaction] Error: ${error.message}`);
    throw error;
  }
};

// Function to confirm a transaction
export const confirmTransaction = async (txSignature: string) => {
  try {
    const response = await fetch("/api/confirmTx", {
      method: "POST",
      body: JSON.stringify({ txSignature }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to confirm transaction: ${data.error || response.statusText}`);
    }

    return data.confirmed;
  } catch (error: any) {
    console.error(`[confirmTransaction] Error: ${error.message}`);
    throw error;
  }
};
