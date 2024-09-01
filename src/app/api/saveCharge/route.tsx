// pages/api/saveBurn.js
import { connectToDatabase } from '@/lib/mongodb';
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { getPremiumPoints } from "@/lib/raydium"

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
        const solPrice = await fetch('https://api-v3.raydium.io/mint/price?mints=So11111111111111111111111111111111111111112')
        if(solPrice.ok){
            const solData = await solPrice.json()
            const solPriceUsd = parseFloat(solData.data['So11111111111111111111111111111111111111112'])
            console.log('solpriceusd',solPriceUsd)
            
            points = await getPremiumPoints(amount);
            //console.log('pointgen',points / 30)
            //console.log(Math.cbrt(points))
            //console.log('markup',(amount*solPriceUsd)/(computeCost * points)) //usd/sec * sec) / sol*usd/sol) == usd / usd
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
      let walletDoc = await collection.findOne({ wallet: wallet });

      if (walletDoc) {
        // If the document exists, push the new burn data to the wallet array
        await collection.updateOne(
          { wallet },
          {
            $inc: {
              credits: points
              },
          },
        );
      } else {
        return new Response('No Chat Owner', {
            status: 500,
        })
      }

      //res.status(200).json({ message: 'Burn saved successfully' });
      return new Response('Charge saved successfully', {
        status: 200,
      })
    } catch (error) {
      console.error('Error saving charge data:', error);
      //res.status(500).json({ message: 'Error saving burn data' });
      return new Response('Error saving charge data', {
        status: 500,
      })
    }

}
