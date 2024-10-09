// pages/api/saveBurn.js
import { connectToDatabase } from '@/lib/mongodb';
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { fetchBalanceByPublicKey } from '@/utils/alchemy';
import { fetchBurnsByPublicKey } from '@/utils/stbDb'
import { fetchUserExpByPublicKey } from '@/utils/stbDb'

export async function POST(req: NextRequest, res: NextApiResponse) {
  
    const { wallet, amount, hash, group } = await req.json();
    let qoints = 0;
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
            //read account exp, 
            const userExp = await fetchUserExpByPublicKey(wallet); // Fetch user experience
            console.log('userstats',userExp)
            //read account burn total
            const userBurns = await fetchBurnsByPublicKey(wallet); // Fetch user burn total
            console.log('userBurns',userBurns)
            //read account balance
            const userBalance = await fetchBalanceByPublicKey(wallet); // Fetch MS2 balance
            console.log('userBalance',userBalance)
            //calculate discount
            const discounts = calculateDiscounts(userExp, userBurns, userBalance);
            console.log('discounts',discounts,'solPriceUsd',solPriceUsd)
            //calculate point total from amount and discount
            // Calculate qoints from amount and discount
            const pointCost = calculatePointsPerSol(discounts,solPriceUsd)
              // const baseCostPerPoint = 0.001284; // Base cost per point in USD
              // const effectiveDiscount = Math.min(discounts.ms2BalanceDiscount + discounts.ms2BurnDiscount + discounts.levelDiscount, 75);
              // console.log('discount',effectiveDiscount)
              // const discountedCostPerPoint = baseCostPerPoint * (1 - effectiveDiscount / 100);
              // console.log('discount cost basis',discountedCostPerPoint)
            //qoints = amount SOL * sol price USD/SOL (USD) / discountedcostperpoint USD / POINT
            console.log('pointCostpersol',pointCost)
            qoints = amount * pointCost;
            console.log('qoints',qoints)
        } else {
            throw Error('no response from raydium')
        }
        
    } catch(error) {
        console.error('Error saving burn data, point calculation error:', error);
      return new Response('Error saving burn data cause points', {
        status: 500,
      })
    }

    try {
      const client = await connectToDatabase();
      const db = client.db('stationthisbot');
      // Insert into the charges collection
      const chargesCollection = db.collection('charges');
      let chargeDoc = await chargesCollection.findOne({ wallet });
      if (chargeDoc) {
        console.log('found a charge doc so we will just push a charge object to the wallet entry')
        // If the document exists, push the new burn data to the wallet array
        await chargesCollection.updateOne(
          { wallet },
          {
            $push: {
              charges: {
                amount,
                qoints,
                hash,
                group: group || null
              },
            },
          }
        );
      } else {
        // If the document does not exist, create a new document
        console.log('we dont have a charge doc for this wallet, so we are gonna push a new one')
        await chargesCollection.insertOne({
          wallet,
          charges: [
            {
              amount,
              qoints,
              hash,
              group: group || null
            },
          ],
        });
      }
      let collection;
      //if group flag true modify group object in floorplan
      //else modify user object 
      if(!group) {
        console.log('choosing user collection')
        collection = db.collection('users');
      } else {
        console.log('choosing group collection')
        collection = db.collection('floorplan')
      }

      // Find the wallet document
      //or group document
      let walletDoc = await collection.findOne({ wallet: wallet });
      
      //here we need to update the user or group qoints and add how many qoints they purchased

      //we should also update a charge document similar to how we have saved burns example shown in the comment below
      
      if (walletDoc) {
        //update either group or user document to increment the qoints they have
        await collection.updateOne(
          { wallet },
          {
            $inc: {
              qoints: qoints
              },
          },
        );

        return new Response('Charge saved successfully', {
          status: 200,
        })

      } else {
        return new Response('No Chat Owner', {
            status: 500,
        })
      }
      
    } catch (error) {
      console.error('Error saving charge data:', error);
      return new Response('Error saving charge data', {
        status: 500,
      })
    }

}

function calculateDiscounts(userExp:any, userBurns:number, userBalance:number) {
  let ms2BalanceDiscount = userBalance >= 6000000 ? 25 : (userBalance / 600000) * 25;
  let ms2BurnDiscount = userBurns >= 300000 ? 25 : (userBurns / 300000) * 25;
  let userLevel = Math.floor(Math.cbrt(userExp.exp));
  let levelDiscount = userLevel >= 100 ? 25 : (userLevel / 100) * 25;

  return {
      ms2BalanceDiscount: Math.min(ms2BalanceDiscount, 25),
      ms2BurnDiscount: Math.min(ms2BurnDiscount, 25),
      levelDiscount: Math.min(levelDiscount, 25),
  };
}

const calculatePointCost = (discounts: { ms2BalanceDiscount: number, ms2BurnDiscount: number, levelDiscount: number }) => {
    
  const baseCostPerPoint = 0.001284; // Base cost for the user with no discounts
  if(!discounts){
    return baseCostPerPoint
  }
  // Calculate the total discount by summing the three discount types
  const totalDiscount = (discounts.ms2BalanceDiscount || 0) + (discounts.ms2BurnDiscount || 0) + (discounts.levelDiscount || 0);
  
  // Cap the total discount at 75% (if total discount exceeds 75)
  const effectiveDiscount = Math.min(totalDiscount, 75);
  
  // Calculate the final cost per point by applying the discount to the base cost
  const discountedCostPerPoint = baseCostPerPoint * (1 - effectiveDiscount / 100);
  
  // Return the final cost per point
  return discountedCostPerPoint;  // Format to 6 decimal places
};

const calculatePointsPerSol = (discounts:any, solPrice:number) => {
  
      const pointCostInUSD = calculatePointCost(discounts);
      const pointsPerSolCalc = solPrice / pointCostInUSD; // SOL to point conversion
      return pointsPerSolCalc
    
};
