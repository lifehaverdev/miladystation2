// pages/api/getGenerations.ts
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

// Define the Generation interface
interface Generation {
    id: string;
    url: string;
    prompt: string;
}

// Fetch generations from MongoDB
const fetchGenerationsByPublicKey = async (publicKey: string, page: number): Promise<Generation[]> => {
    const uri = process.env.MONGO_URI || 'meh'; // MongoDB connection URI from environment variables
    const dbName = 'stationthisbot';  // Replace with your actual database name
    const pageSize = 10;  // Number of documents (images) to return per page

    const client = new MongoClient(uri);
    //console.log('here we gooooo!!!!!')
    try {
        // Connect to MongoDB
        await client.connect();

        // Access the "gens" collection in the database
        const db = client.db(dbName);
        const gensCollection = db.collection('gens');

        // Query the collection for generations filtered by wallet (publicKey)
        const generations = await gensCollection
            .find({ 'promptObj.wallet': publicKey })  // Search inside promptObj for the wallet
            .skip((page - 1) * pageSize)              // Skip documents for pagination
            .limit(pageSize)                          // Limit results to 10 documents
            .toArray();                               // Convert to an array

        console.log(generations[0].urls)
        // Return a mapped result with the necessary fields
        return generations.map((gen) => ({
            id: gen._id.toString(),          // Convert MongoDB ObjectId to string
            url: gen.urls[0].url || '',           // Assuming 'fileUrl' contains the image URL
            prompt: gen.promptObj.prompt || '',         // Assuming 'prompt' contains the prompt text
        }));

    } catch (error) {
        console.error('Error fetching generations:', error);
        throw error;
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
};

// POST request handler for Next.js API route
export async function POST(req: NextRequest) {
    try {
        // Extract the publicKey and page number from the request body
        const { publicKey, page } = await req.json();

        // Validate the parameters
        if (!publicKey || typeof page !== 'number') {
            return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
        }

        // Fetch generations from the database
        const generations = await fetchGenerationsByPublicKey(publicKey, page);

        // Return the fetched generations as JSON
        return NextResponse.json(generations, { status: 200 });
        

    } catch (error) {
        console.error('Error fetching generations:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}