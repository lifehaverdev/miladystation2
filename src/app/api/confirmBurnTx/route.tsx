import { Connection } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export type TxConfirmData = {
  confirmed: boolean;
  message: string;
};

export async function POST(req: NextRequest, res: NextApiResponse) {
    const { txSignature } = await req.json();

    const CUSTOM_RPC_URL = process.env.HELIUS || 'default_rpc_url';

    if (!CUSTOM_RPC_URL) {
        throw new Error('Missing CUSTOM_RPC_URL environment variable');
    }

    const connection = new Connection(CUSTOM_RPC_URL, 'processed');

    const latestBlockhash = await connection.getLatestBlockhash("finalized");
    try {
      const confirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      if (confirmation.value.err) {
          return new Response(JSON.stringify({
            confirmed: false,
            message: "Transaction not confirmed"
            }), {
            status: 200,
          })
      }

        return new Response(JSON.stringify({
            confirmed: true,
            message: "Transaction confirmed"
            }), {
            status: 200,
          })
        
    } catch (e) {
        return new Response(JSON.stringify({
            confirmed: false,
            message: "Transaction not confirmed"
            }), {
            status: 200,
        })
    }
}