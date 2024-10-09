import { NextRequest } from 'next/server';
import { fetchBalanceByPublicKey } from '@/utils/alchemy';

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
