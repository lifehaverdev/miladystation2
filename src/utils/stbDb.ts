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
