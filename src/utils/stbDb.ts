import { MongoClient } from 'mongodb';

// Fetch burn data from MongoDB
export const fetchBurnsByPublicKey = async (publicKey: string): Promise<number> => {
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

// Fetch user core data from MongoDB
export const fetchUserCoreByPublicKey = async (publicKey: string): Promise<any> => {
    const uri = process.env.MONGO_URI || 'meh';
    const dbName = 'stationthisbot';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCoreCollection = db.collection('users_core');

        const userCore = await usersCoreCollection.findOne({ 'wallet': publicKey });
        
        if (userCore) {
            return {
                userId: userCore.userId,
                wallet: userCore.wallet
            };
        }
        return null;

    } catch (error) {
        console.error('Error fetching user core data:', error);
        throw error;
    } finally {
        await client.close();
    }
};

// Fetch user economy data from MongoDB
export const fetchUserEconomyByUserId = async (userId: string): Promise<any> => {
    const uri = process.env.MONGO_URI || 'meh';
    const dbName = 'stationthisbot';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersEconomyCollection = db.collection('users_economy');

        const userEconomy = await usersEconomyCollection.findOne({ 'userId': userId });
        
        if (userEconomy) {
            return {
                exp: userEconomy.exp || 0,
                points: userEconomy.points || 0,
                doints: userEconomy.doints || 0,
                qoints: userEconomy.qoints || 0,
            };
        }
        return null;

    } catch (error) {
        console.error('Error fetching user economy data:', error);
        throw error;
    } finally {
        await client.close();
    }
};
