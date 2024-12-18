import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
  } from "@solana/web3.js";
  import { NextRequest } from "next/server";

const tipJar = '8T4xCnScnAHmHYPXEqVJ51eKDSkpjpDL9FayqJc8s1RZ'; // ms2 3

export async function POST(req: NextRequest) {
  try {
    const {
      publicKey,
      amount = 1,
      type = "sol",
    } = await req.json();

    // Validate inputs
    if (!publicKey || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }), 
        { status: 400 }
      );
    }

    const HELIUS_URL = process.env.HELIUS;
    if (!HELIUS_URL) {
      throw new Error('Missing HELIUS environment variable');
    }

    // Create connection with commitment level
    const connection = new Connection(HELIUS_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

    const payer = new PublicKey(publicKey);
    const receiver = new PublicKey(tipJar);

    let transaction = new Transaction();

    if (type === "sol") {
      const payInstruction = SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: receiver,
        lamports: Math.floor(amount * LAMPORTS_PER_SOL),
      });
      transaction.add(payInstruction);
    }

    // Get latest blockhash with retry
    let blockHash;
    try {
      const { blockhash } = await connection.getLatestBlockhash("finalized");
      blockHash = blockhash;
    } catch (error) {
      console.error('Failed to get blockhash:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to get blockhash' }), 
        { status: 500 }
      );
    }

    transaction.feePayer = payer;
    transaction.recentBlockhash = blockHash;

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: true,
    });

    const transactionBase64 = serializedTransaction.toString("base64");

    return new Response(
      JSON.stringify({ transactionBase64 }), 
      { status: 200 }
    );

  } catch (error) {
    console.error('Transaction creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create transaction' }), 
      { status: 500 }
    );
  }
}


