import { connectToDatabase } from '@/lib/mongodb';
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { fetchBalanceByPublicKey } from '@/utils/alchemy';
import { fetchBurnsByPublicKey } from '@/utils/stbDb';
import { fetchUserCoreByPublicKey } from '@/utils/stbDb';
import { fetchUserEconomyByUserId } from '@/utils/stbDb';
import crypto from "crypto";

export async function POST(req: NextRequest, res: NextApiResponse) {
  
    const { wallet, amount, hash: txSignature, group, timestamp, authHash } = await req.json();
    let qoints = 0;

    if (!wallet || !amount || !txSignature || !timestamp || !authHash) {
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
      return new Response('Invalid authorization token', {
        status: 401,
      });
    }

    // Check if the timestamp is within an acceptable window (e.g., 10 minutes)
    const currentTime = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (currentTime - timestamp > tenMinutes) {
      return new Response('Authorization expired', {
        status: 401,
      });
    }

    try {
      const client = await connectToDatabase();
      const db = client.db('stationthisbot');
      
      // Get the userId first
      const userCore = await fetchUserCoreByPublicKey(wallet);
      if (!userCore) {
        return new Response('User not found', {
          status: 404,
        });
      }

      // Check if txSignature has already been used
      const chargesCollection = db.collection('charges');
      const existingCharge = await chargesCollection.findOne({
        "charges.hash": txSignature,
        wallet,
      });

      if (existingCharge) {
        return new Response('Transaction already used', {
          status: 401,
        });
      }

      const solPrice = await fetch('https://api-v3.raydium.io/mint/price?mints=So11111111111111111111111111111111111111112');
      if (solPrice.ok) {
          const solData = await solPrice.json();
          const solPriceUsd = parseFloat(solData.data['So11111111111111111111111111111111111111112']);
          console.log('solpriceusd', solPriceUsd);
          // Read account exp, 
          const userId = await fetchUserCoreByPublicKey(wallet); // Fetch user userId
          console.log('userstats', userId);
          const userExp = await fetchUserEconomyByUserId(userId.userId); // Fetch user experience
          console.log('userExp', userExp);
          // Read account burn total
          const userBurns = await fetchBurnsByPublicKey(wallet); // Fetch user burn total
          console.log('userBurns', userBurns);
          // Read account balance
          const userBalance = await fetchBalanceByPublicKey(wallet); // Fetch MS2 balance
          console.log('userBalance', userBalance);
          // Calculate discount
          const discounts = calculateDiscounts(userExp, userBurns, userBalance);
          console.log('discounts', discounts, 'solPriceUsd', solPriceUsd);
          // Calculate qoints from amount and discount
          const pointCost = calculatePointsPerSol(discounts, solPriceUsd);
          console.log('pointCostpersol', pointCost);
          qoints = amount * pointCost;
          console.log('qoints', qoints);
      } else {
          throw Error('no response from raydium');
      }

      // Insert into the charges collection
      let chargeDoc = await chargesCollection.findOne({ wallet });
      if (chargeDoc) {
        console.log('found a charge doc so we will just push a charge object to the wallet entry');
        // If the document exists, push the new charge data to the wallet array
        await chargesCollection.updateOne(
          { wallet },
          {
            $push: {
              charges: {
                amount,
                qoints,
                hash: txSignature,
                group: group || null
              },
            },
          }
        );
      } else {
        // If the document does not exist, create a new document
        console.log('we dont have a charge doc for this wallet, so we are gonna push a new one');
        await chargesCollection.insertOne({
          wallet,
          charges: [
            {
              amount,
              qoints,
              hash: txSignature,
              group: group || null
            },
          ],
        });
      }

      let collection = db.collection('global_status');

      // Create the charge purchase entry with userId
      const chargePurchaseEntry = {
          id: Date.now().toString(),
          userId: userCore.userId,
          walletAddress: wallet,
          pendingQoints: qoints,
          txHash: txSignature,
          amount: amount,
          timestamp: new Date(),
          status: 'pending'
      };

      // Add the entry to the chargePurchases array in global_status
      const result = await collection.updateOne(
          { type: 'globalStatus' },
          {
              $push: { 
                  chargePurchases: chargePurchaseEntry 
              },
              $set: {
                  updatedAt: new Date()
              }
          },
          { upsert: true }
      );

      if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          return new Response(JSON.stringify({ 
              success: true, 
              message: 'Charge purchase recorded successfully',
              purchaseId: chargePurchaseEntry.id
          }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
          });
      } else {
          return new Response('Failed to record charge purchase', {
              status: 500,
          });
      }

    } catch (error) {
      console.error('Error saving charge purchase:', error);
      return new Response('Error saving charge purchase data', {
          status: 500,
      });
    }
}

function calculateDiscounts(userExp: any, userBurns: number, userBalance: number) {
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
  const baseCostPerPoint = 0.01; // Base cost for the user with no discounts
  if (!discounts) {
    return baseCostPerPoint;
  }
  // Calculate the total discount by summing the three discount types
  const totalDiscount = (discounts.ms2BalanceDiscount || 0) + (discounts.ms2BurnDiscount || 0) + (discounts.levelDiscount || 0);
  
  // Cap the total discount at 75% (if total discount exceeds 75)
  const effectiveDiscount = Math.min(totalDiscount, 75);
  
  // Calculate the final cost per point by applying the discount to the base cost
  const discountedCostPerPoint = baseCostPerPoint * (1 - effectiveDiscount / 100);
  
  // Return the final cost per point
  return discountedCostPerPoint; // Format to 6 decimal places
};

const calculatePointsPerSol = (discounts: any, solPrice: number) => {
  const pointCostInUSD = calculatePointCost(discounts);
  const pointsPerSolCalc = solPrice / pointCostInUSD; // SOL to point conversion
  return pointsPerSolCalc;
};
