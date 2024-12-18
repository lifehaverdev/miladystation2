import { NextRequest } from 'next/server';
import { fetchUserCoreByPublicKey, fetchUserEconomyByUserId } from '@/utils/stbDb';

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

        // Fetch user core data first
        const userCore = await fetchUserCoreByPublicKey(publicKey);
        
        if (!userCore) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
            });
        }

        // Fetch user economy data using the userId from userCore
        const userEconomy = await fetchUserEconomyByUserId(userCore.userId);

        // Combine both data sets
        const userData = {
            ...userCore,
            ...userEconomy
        };

        return new Response(JSON.stringify(userData), {
            status: 200,
        });

    } catch (error) {
        console.error('Error fetching user experience:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
}
