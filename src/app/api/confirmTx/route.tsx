import { Connection } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import crypto from "crypto";

export type TxConfirmData = {
  confirmed: boolean;
  message: string;
  authHash?: string; // The generated authorization hash
  timestamp?: number; // The timestamp used in hash generation
};

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, res: NextApiResponse) {
  const { txSignature } = await req.json();

  const CUSTOM_RPC_URL = process.env.HELIUS || "default_rpc_url";
  const CONF_SALT = process.env.CONF_SALT || "";

  if (!CUSTOM_RPC_URL) {
    throw new Error("Missing CUSTOM_RPC_URL environment variable");
  }

  if (!CONF_SALT) {
    throw new Error("Missing CONF_SALT environment variable");
  }

  const connection = new Connection(CUSTOM_RPC_URL, "processed");

  const latestBlockhash = await connection.getLatestBlockhash("finalized");
  try {
    const confirmation = await connection.confirmTransaction({
      signature: txSignature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    if (confirmation.value.err) {
      return new Response(
        JSON.stringify({
          confirmed: false,
          message: "Transaction not confirmed",
        }),
        {
          status: 200,
        }
      );
    }

    // Generate a timestamp (in milliseconds)
    const timestamp = Date.now();

    // Generate a hash combining txSignature, CONF_SALT, and timestamp
    const authHash = crypto
      .createHash("sha256")
      .update(txSignature + CONF_SALT + timestamp)
      .digest("hex");

    return new Response(
      JSON.stringify({
        confirmed: true,
        message: "Transaction confirmed",
        authHash, // Include the generated hash
        timestamp, // Include the timestamp for verification
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        confirmed: false,
        message: "Transaction not confirmed",
      }),
      {
        status: 200,
      }
    );
  }
}
