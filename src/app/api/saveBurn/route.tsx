// pages/api/saveBurn.js
import { connectToDatabase } from '@/lib/mongodb';
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

// interface Burn {
//     amount: number;
//     service: string;
//     projectName: string;
//     twitterHandle: string;
//     telegramHandle: string;
//     hash: string;
//   }
  
//   interface WalletBurnDocument {
//     wallet: string;
//     burns: Burn[];
//   }

export async function POST(req: NextRequest, res: NextApiResponse) {
  
    const { wallet, amount, service, projectName, twitterHandle, telegramHandle, hash } = await req.json();

    if (!wallet || !amount || !service || !hash) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
      const client = await connectToDatabase();
      const db = client.db('stationthisbot');
      const collection = db.collection('burns');

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
                hash,
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
              hash,
            },
          ],
        });
      }

      //res.status(200).json({ message: 'Burn saved successfully' });
      return new Response('Burn saved successfully', {
        status: 200,
      })
    } catch (error) {
      console.error('Error saving burn data:', error);
      //res.status(500).json({ message: 'Error saving burn data' });
      return new Response('Error saving burn data', {
        status: 500,
      })
    }

}
