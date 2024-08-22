import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
  } from "@solana/web3.js";
  import { NextRequest } from "next/server";
//   import {
//     Token, TOKEN_PROGRAM_ID
//   } from "@solana/spl-token";

//const DEFAULT_TOKEN = 'AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg';
const tipJar = '8T4xCnScnAHmHYPXEqVJ51eKDSkpjpDL9FayqJc8s1RZ'; //ms2 3
  
  export type TxCreateData = {
    tx: string;
  };
  
  export type Input = {
    publicKey: string;
    amount?: number;
    type: "sol" | "token";
    tokenAddress: string;
  };
  
export async function POST(req: NextRequest) {
      const {
        publicKey,
        amount = 1,
        type = "sol",
        //tokenAddress,
      } = await req.json() as Input;

      const CUSTOM_RPC_URL = process.env.HELIUS || 'default_rpc_url';

        if (!CUSTOM_RPC_URL) {
            throw new Error('Missing CUSTOM_RPC_URL environment variable');
        }

        const connection = new Connection(CUSTOM_RPC_URL, 'processed');

  
      const payer = new PublicKey(publicKey);
      const receiver = new PublicKey(tipJar)
      //const mintPublicKey = new PublicKey(DEFAULT_TOKEN)
      //const tokenAccountPublicKey = new PublicKey(tokenAddress)
  
      let transaction = new Transaction();
  
      if (type === "sol") {
        /*
        const payInstruction = Token.createBurnInstruction(
            TOKEN_PROGRAM_ID,
            mintPublicKey,
            tokenAccountPublicKey,
            payer,
            [],
            amount
        );
        */
        const payInstruction = SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: receiver,
            lamports: amount * LAMPORTS_PER_SOL,
        })
        transaction.add(payInstruction);
    }
  
      const blockHash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;
  
      transaction.feePayer = payer;
      transaction.recentBlockhash = blockHash;
  
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: true,
      });
  
      const transactionBase64 = serializedTransaction.toString("base64");
  
      return new Response(JSON.stringify({transactionBase64}), {
        status: 200,
      })
    
  }


