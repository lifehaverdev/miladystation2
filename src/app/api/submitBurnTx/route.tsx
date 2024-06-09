import { Connection, Transaction } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export type TxSendData = {
  txSignature: string;
};

export async function POST(req: NextRequest, res: NextApiResponse) {
    const { signedTx } = await req.json();

    const CUSTOM_RPC_URL = process.env.HELIUS || 'default_rpc_url';

    if (!CUSTOM_RPC_URL) {
        throw new Error('Missing CUSTOM_RPC_URL environment variable');
    }

    const connection = new Connection(CUSTOM_RPC_URL, 'processed');
    const tx = Transaction.from(Buffer.from(signedTx, "base64"));

    const txSignature = await connection.sendRawTransaction(tx.serialize());

    return new Response(JSON.stringify({txSignature}), {
        status: 200,
      })

}
