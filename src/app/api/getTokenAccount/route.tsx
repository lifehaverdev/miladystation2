import type { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const CUSTOM_RPC_URL = process.env.HELIUS || 'default_rpc_url';

if (!CUSTOM_RPC_URL) {
    throw new Error('Missing CUSTOM_RPC_URL environment variable');
}
const connection = new Connection(CUSTOM_RPC_URL, 'processed');

const getTokenAccountByMint = async (connection: Connection, publicKey: PublicKey, mintAddress: string) => {
    console.log('getting token account');
    try {
        const response = await connection.getTokenAccountsByOwner(
            publicKey,
            {
                mint: new PublicKey(mintAddress),
            },
            'processed'
        );

        if (response.value.length === 0) {
            throw new Error('No token account found for the specified mint address.');
        }

        return response.value[0]; // Return the first matching token account
    } catch (error) {
        console.error('Error fetching token account by mint:', error);
        throw error;
    }
};

export async function GET(req: NextRequest) {
    console.log('we fetch token account now');
    const publicKey = req.nextUrl.searchParams.get('publicKey');
    console.log('here is the public key we have',publicKey)
    const mintAddress = "AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg"

    if (!publicKey || !mintAddress) {
        return new Response('Missing publicKey or mintAddress', {
            status: 400,
        });
    }

    try {
        const tokenAccount = await getTokenAccountByMint(connection, new PublicKey(publicKey), mintAddress);
        return new Response(JSON.stringify({ tokenAccount }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response('Failed to fetch token account', {
            status: 500,
        });
    }
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    res.status(405).json({ error: 'Method Not Allowed' });
}
