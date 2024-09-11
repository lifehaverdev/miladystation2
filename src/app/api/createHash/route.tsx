// app/api/createHash/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js'; // For generating the hash

const SALT = process.env.SALT || 'your-secure-salt'; // Salt value stored in environment variables

export async function POST(req: NextRequest) {
    try {
        const { publicKey, timestamp } = await req.json();

        if (!publicKey || !timestamp) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Generate the hash on the server-side using the salt, publicKey, and timestamp
        const hash = CryptoJS.SHA256(publicKey + timestamp + SALT).toString();

        // Log the generated hash for debugging (optional, but don't keep this in production)
        console.log('Generated Hash:', hash);

        // Return the hash to the client
        return NextResponse.json({ hash }, { status: 200 });
    } catch (error) {
        console.error('Error generating hash:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
