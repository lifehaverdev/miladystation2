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
  
    const { wallet, amount, projectName, twitterHandle, telegramHandle, hash } = await req.json();
    let points = 0;
    if (!wallet || !amount || !hash) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    try {
        const raydiumResponse = await fetch('https://api-v3.raydium.io/pools/info/mint?mint1=AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg&poolType=all&poolSortField=default&sortType=desc&pageSize=1&page=1')
        if(raydiumResponse.ok){
            const data = await raydiumResponse.json()
            const price = 100 / data.data.data[0].price
            console.log(price);
            const ms2Amount = price * amount;
            points = ms2Amount / 540;
            console.log(points)
        } else {
            throw Error('no response from raydium')
        }
        
    } catch(error) {
        console.error('Error saving burn data, point calculation error:', error);
      //res.status(500).json({ message: 'Error saving burn data' });
      return new Response('Error saving burn data cause points', {
        status: 500,
      })
    }

    try {
      const client = await connectToDatabase();
      const db = client.db('stationthisbot');
      const collection = db.collection('floorplan');

      // Find the wallet document
      let walletDoc = await collection.findOne({ owner: wallet });

      if (walletDoc) {
        // If the document exists, push the new burn data to the wallet array
        await collection.updateOne(
          { wallet },
          {
            $push: {
              charges: {
                amount,
                points,
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
              points,
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
