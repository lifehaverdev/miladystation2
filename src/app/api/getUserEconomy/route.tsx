import { NextRequest } from 'next/server';
import { fetchUserEconomyByUserId } from '@/utils/stbDb';

// POST request handler for Next.js API route
export async function POST(req: NextRequest) {
    try {
        // Extract the publicKey from the request body
        const { userId } = await req.json();

        // Validate the parameters
        if (!userId) {
            return new Response(JSON.stringify({ error: 'Missing or invalid parameters' }), {
                status: 400,
            });
        }
        console.log('get economy userId', userId);
        // Fetch user experience and points data from the database
        const userData = await fetchUserEconomyByUserId(userId);
        console.log('get economyuserData', userData);
        // Return the fetched data as JSON, or an error if not found
        if (userData) {
            return new Response(JSON.stringify(userData), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
            });
        }

    } catch (error) {
        console.error('Error fetching user experience:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
}
