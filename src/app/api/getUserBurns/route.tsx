import { NextRequest, NextResponse } from 'next/server';
import { fetchBurnsByPublicKey } from '@/utils/stbDb';

// POST request handler for Next.js API route
export async function POST(req: NextRequest) {
    try {
        // Extract the publicKey from the request body
        const { publicKey } = await req.json();

        // Validate the parameters
        if (!publicKey) {
            return new Response(JSON.stringify({ error: 'Missing or invalid parameters' }), {
                status: 400,
            });
        }

        // Fetch user burn data from the database
        const totalBurn = await fetchBurnsByPublicKey(publicKey);

        // Return the total burn amount as JSON
        return new Response(JSON.stringify({ totalBurn }), {
            status: 200,
        });

    } catch (error) {
        console.error('Error fetching burn data:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
}
