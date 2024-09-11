// app/api/verify/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // To generate JWT tokens.
import CryptoJS from 'crypto-js'; // For generating the hash

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Secret key for JWT signing
const SALT = process.env.SALT || 'yoursaltvalue'; // Salt value

export async function POST(req: NextRequest) {
    try {
        // Get the data from the request body
        const { publicKey, timestamp, clientHash } = await req.json();
        console.log('public key', publicKey, 'timestamp', timestamp, 'clientHash', clientHash)
        if (!publicKey || !timestamp || !clientHash) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Validate that the timestamp is recent (e.g., within 5 minutes)
        const currentTime = Math.floor(Date.now() / 60000);
        if (currentTime - timestamp > 5) {
            return NextResponse.json({ error: 'Nonce expired' }, { status: 400 });
        }
        //const clientHash = CryptoJS.SHA256(saltedMessage).toString();
        // Recreate the hash on the server side using the same salt and timestamp
        const saltedMessage = publicKey + timestamp + process.env.SALT; // Combine publicKey, timestamp, and salt
        const serverHash = CryptoJS.SHA256(saltedMessage).toString();
        console.log(serverHash)

        // Compare the client-provided hash with the server-generated hash
        if (clientHash !== serverHash) {
            console.log('invalid hash')
            return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
        }

        // Generate a JWT token if the hash is valid
        const token = jwt.sign(
            { publicKey }, // Payload (in this case, the public key)
            JWT_SECRET, // Secret key for signing the JWT
            { expiresIn: '1h' } // Token expiration time (e.g., 1 hour)
        );

        // Return the generated JWT token to the client
        return NextResponse.json({ token }, { status: 200 });

    } catch (error) {
        console.error('Error processing wallet verification: ', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
