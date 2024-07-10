import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_PASS;
const dbName = process.env.BOT_NAME;

let db;

const connectToMongoDB = async () => {
    if (db) return db; // Return the existing connection if already connected
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to MongoDB");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

const getRuns = async (walletAddress) => {
    const uri = process.env.MONGO_PASS;

    // Create a new MongoClient
    const client = new MongoClient(uri);
    const collection = client.db(dbName).collection('userRuns');
    try {
        // Find the document with the given wallet address
        let userData = await collection.findOne({ wallet: walletAddress });

        // If document doesn't exist, insert default user data
        if (!userData) {
            const defaultUserData = []//{ /* Your default user data */ };
            await collection.insertOne({
                wallet: walletAddress,
                runs: []
            });
            userData = defaultUserData;
            console.log('Default user initialized');
        }

        console.log('User data retrieved successfully');
        return userData;
    } catch (error) {
        console.error("Error getting user data:", error);
        //throw error;
        return false
    } finally {
        await client.close();
    }

}

export { 
    connectToMongoDB,
    getRuns
 };
