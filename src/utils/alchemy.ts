// Replace with your Alchemy API key
const apiKey = process.env.ALCHEMY_SECRET;
const fetchURL = `https://solana-mainnet.g.alchemy.com/v2/${apiKey}`;

// Replace with the token mint address for MS2 on Solana
const tokenMintAddr = "AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg";

// Function to fetch MS2 balance for a given wallet address
export const fetchBalanceByPublicKey = async (publicKey: string): Promise<number> => {
  const raw = JSON.stringify({
    jsonrpc: "2.0",
    method: "getTokenAccountsByOwner",
    params: [
      publicKey,
      { mint: tokenMintAddr },
      { encoding: "jsonParsed" }
    ],
    id: 1
  });

  const requestOptions = {
    method: 'POST',
    body: raw,
    headers: { "Content-Type": "application/json" },
  };

  try {
    // Make the request to Alchemy API
    const response = await fetch(fetchURL, requestOptions);

    const data = await response.json();

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

    return balance;

  } catch (error: any) {
    console.error(`[fetchBalanceByPublicKey] Error fetching balance: ${error.message}`);
    throw error;
  }
};
