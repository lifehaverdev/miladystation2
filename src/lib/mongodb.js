// lib/mongodb.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}



// Global is used here to maintain a cached connection across hot reloads in development. Otherwise, a new connection will be created on every request.
let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  cachedClient = client;
  return client;
}

