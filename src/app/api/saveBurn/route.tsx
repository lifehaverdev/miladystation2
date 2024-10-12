import { connectToDatabase } from '@/lib/mongodb';
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest, res: NextApiResponse) {
  
  const { wallet, amount, service, projectName, twitterHandle, telegramHandle, hash: txSignature, timestamp, authHash } = await req.json();

  if (!wallet || !amount || !service || !txSignature || !timestamp || !authHash) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const CONF_SALT = process.env.CONF_SALT || "";

  // Generate the expected hash using txSignature, CONF_SALT, and timestamp
  const expectedAuthHash = crypto
    .createHash("sha256")
    .update(txSignature + CONF_SALT + timestamp)
    .digest("hex");

  // Compare the provided authHash with the generated hash
  if (authHash !== expectedAuthHash) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid authorization token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if the timestamp is within an acceptable window (e.g., 10 minutes)
  const currentTime = Date.now();
  const tenMinutes = 10 * 60 * 1000;

  if (currentTime - timestamp > tenMinutes) {
    return new Response(JSON.stringify({ success: false, message: 'Authorization expired' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('stationthisbot');
    const collection = db.collection('burns');

    // Check if txSignature has already been used
    const existingBurn = await collection.findOne({
      "burns.hash": txSignature,
      wallet,
    });

    if (existingBurn) {
      return new Response(JSON.stringify({ success: false, message: 'Transaction already used' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the wallet document
    let walletDoc = await collection.findOne({ wallet });

    if (walletDoc) {
      // If the document exists, push the new burn data to the wallet array
      await collection.updateOne(
        { wallet },
        {
          $push: {
            burns: {
              amount,
              service,
              projectName,
              twitterHandle,
              telegramHandle,
              hash: txSignature,
            },
          },
        }
      );
    } else {
      // If the document does not exist, create a new document
      await collection.insertOne({
        wallet,
        burns: [
          {
            amount,
            service,
            projectName,
            twitterHandle,
            telegramHandle,
            hash: txSignature,
          },
        ],
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Burn saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error saving burn data:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error saving burn data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
