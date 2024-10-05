import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Fetch burn data from MongoDB
const fetchBurnsByPublicKey = async (publicKey: string): Promise<number> => {
    const uri = process.env.MONGO_URI || 'meh'; // MongoDB connection URI from environment variables
    const dbName = 'stationthisbot';  // Replace with your actual database name

    const client = new MongoClient(uri);
    
    try {
        // Connect to MongoDB
        await client.connect();

        // Access the "burns" collection in the database
        const db = client.db(dbName);
        const burnsCollection = db.collection('burns');

        // Query the collection for the burns filtered by wallet (publicKey)
        const burnDoc = await burnsCollection.findOne({ 'wallet': publicKey });

        // If a burn document is found, calculate the total burn amount
        if (burnDoc && burnDoc.burns && Array.isArray(burnDoc.burns)) {
            const totalBurn = burnDoc.burns.reduce((sum, burn) => {
                return sum + (burn.amount / 1000000);  // Divide amount by 1,000,000
            }, 0);
            return totalBurn;
        } else {
            return 0;  // Return 0 if no burns are found
        }

    } catch (error) {
        console.error('Error fetching burn data:', error);
        throw error;
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
};

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
