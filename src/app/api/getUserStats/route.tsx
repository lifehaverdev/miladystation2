import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Fetch user data from MongoDB
export const fetchUserExpByPublicKey = async (publicKey: string): Promise<any> => {
    const uri = process.env.MONGO_URI || 'meh'; // MongoDB connection URI from environment variables
    const dbName = 'stationthisbot';  // Replace with your actual database name

    const client = new MongoClient(uri);
    
    try {
        // Connect to MongoDB
        await client.connect();

        // Access the "users" collection in the database
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Query the collection for the user filtered by wallet (publicKey)
        const user = await usersCollection.findOne({ 'wallet': publicKey });

        // If user is found, return the exp, points, doints, and qoints values
        if (user) {
            return {
                exp: user.exp || 0,
                points: user.points || 0,
                doints: user.doints || 0,
                qoints: user.qoints || 0,
            };
        }

        // Return null if user is not found
        return null;

    } catch (error) {
        console.error('Error fetching user experience:', error);
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

        // Fetch user experience and points data from the database
        const userData = await fetchUserExpByPublicKey(publicKey);

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
