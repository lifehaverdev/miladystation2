import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Fetch group chat ownership data from MongoDB
const fetchGroupChatDetailsByPublicKey = async (publicKey: string): Promise<any> => {
    const uri = process.env.MONGO_URI || 'meh'; // MongoDB connection URI from environment variables
    const dbName = 'stationthisbot';  // Replace with your actual database name

    const client = new MongoClient(uri);
    
    try {
        // Connect to MongoDB
        await client.connect();

        // Access the "groupChats" collection in the database
        const db = client.db(dbName);
        const groupChatsCollection = db.collection('floorplan');

        // Query the collection for group chats filtered by wallet (publicKey)
        const groupChat = await groupChatsCollection.findOne({ 'wallet': publicKey });

        // If a group chat document is found, return the necessary fields
        if (groupChat) {
            return {
                name: groupChat.name || 'Unnamed Group',
                zoints: groupChat.zoints || 0,
                points: groupChat.points || 0,
                doints: groupChat.doints || 0,
            };
        }

        // Return false if no group chat is found
        return false;

    } catch (error) {
        console.error('Error fetching group chat data:', error);
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

        // Fetch group chat details if the user owns any group chats
        const groupChatDetails = await fetchGroupChatDetailsByPublicKey(publicKey);

        // Return the group chat details or false if no group chat found
        return new Response(JSON.stringify({ groupChatDetails }), {
            status: 200,
        });

    } catch (error) {
        console.error('Error checking group chat ownership:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
}
