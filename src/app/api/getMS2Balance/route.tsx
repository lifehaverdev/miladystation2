import { NextRequest } from 'next/server';

// Replace with your Alchemy API key
const apiKey = process.env.ALCHEMY_SECRET;
const fetchURL = `https://solana-mainnet.g.alchemy.com/v2/${apiKey}`;

// Replace with the token mint address for MS2 on Solana
const tokenMintAddr = "AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg";

// Function to fetch MS2 balance for a given wallet address
export const fetchBalanceByPublicKey = async (publicKey: string): Promise<number> => {
  //console.log(`[fetchBalanceByPublicKey] Fetching balance for publicKey: ${publicKey}`);

  const raw = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "getTokenAccountsByOwner",
    "params": [
      publicKey,
      { "mint": tokenMintAddr },
      { "encoding": "jsonParsed" }
    ],
    "id": 1
  });

  //console.log(`[fetchBalanceByPublicKey] Request payload: ${raw}`);

  const requestOptions = {
    method: 'POST',
    body: raw,
    headers: { "Content-Type": "application/json" },
  };

  try {
    // Make the request to Alchemy API
    //console.log(`[fetchBalanceByPublicKey] Sending request to Alchemy: ${fetchURL}`);
    const response = await fetch(fetchURL, requestOptions);

    //console.log(`[fetchBalanceByPublicKey] Response status: ${response.status}`);
    const data = await response.json();

    //console.log(`[fetchBalanceByPublicKey] Response data: ${JSON.stringify(data, null, 2)}`);

    // Check if the response contains balance data
    if (data.error) {
      console.error(`[fetchBalanceByPublicKey] Error in response: ${JSON.stringify(data.error)}`);
      return 0;
    }
    
    if (!data.result || !data.result.value || data.result.value.length === 0) {
      console.log(`[fetchBalanceByPublicKey] No token accounts found for the provided publicKey: ${publicKey}`);
      return 0;  // No balance found, return 0
    }

    // Extract and return the balance
    const balance = data.result.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
    //console.log(`[fetchBalanceByPublicKey] Balance found: ${balance} MS2`);

    return balance;

  } catch (error:any) {
    console.error(`[fetchBalanceByPublicKey] Error fetching balance: ${error.message}`);
    throw error;
  }
};

// POST request handler for Next.js API route
export async function POST(req: NextRequest) {
  try {
    //console.log(`[POST] Incoming request to getUserBalance`);

    // Extract the publicKey from the request body
    const { publicKey } = await req.json();
    //console.log(`[POST] Received publicKey: ${publicKey}`);

    // Validate the parameters
    if (!publicKey) {
      console.log(`[POST] Missing publicKey in request body`);
      return new Response(JSON.stringify({ error: 'Missing or invalid parameters' }), {
        status: 400,
      });
    }

    // Fetch the balance using the Alchemy API
    const balance = await fetchBalanceByPublicKey(publicKey);

    //console.log(`[POST] Returning balance: ${balance} MS2`);
    // Return the balance as JSON
    return new Response(JSON.stringify({ balance }), {
      status: 200,
    });

  } catch (error:any) {
    console.error(`[POST] Error in getUserBalance route: ${error.message}`);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}
