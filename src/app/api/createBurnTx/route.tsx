import {
    Connection,
    PublicKey,
    Transaction,
  } from "@solana/web3.js";
  import { NextApiResponse } from "next";
  import { NextRequest } from "next/server";
  import {
    Token, TOKEN_PROGRAM_ID
  } from "@solana/spl-token";

const DEFAULT_TOKEN = 'AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg';
  
  export type TxCreateData = {
    tx: string;
  };
  
  export type Input = {
    publicKey: string;
    amount?: number;
    type: "sol" | "token";
    tokenAddress: string;
  };
  
export async function POST(req: NextRequest, res: NextApiResponse) {
      const {
        publicKey,
        amount = 1,
        type = "token",
        tokenAddress,
      } = await req.json() as Input;

      const CUSTOM_RPC_URL = process.env.HELIUS || 'default_rpc_url';

        if (!CUSTOM_RPC_URL) {
            throw new Error('Missing CUSTOM_RPC_URL environment variable');
        }

        const connection = new Connection(CUSTOM_RPC_URL, 'processed');

  
      const payer = new PublicKey(publicKey);
      const mintPublicKey = new PublicKey(DEFAULT_TOKEN)
      const tokenAccountPublicKey = new PublicKey(tokenAddress)
  
      let transaction = new Transaction();
  
      if (type === "token") {
        const burnInstruction = Token.createBurnInstruction(
            TOKEN_PROGRAM_ID,
            mintPublicKey,
            tokenAccountPublicKey,
            payer,
            [],
            amount
        );
        transaction.add(burnInstruction);
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


