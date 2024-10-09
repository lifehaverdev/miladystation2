import { useCallback, useState } from 'react';
import { calculateDiscounts } from '@/utils/discountCalculations';

interface UserInfo {
  exp: number;
  balance: number;
  burns: number;
  points: number;
  doints: number;
  qoints: number;
  group: any | null;
}

export const useUserData = (publicKey: any) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [solPrice, setSolPrice] = useState<number>(160);
  const [discounts, setDiscounts] = useState({
    ms2BalanceDiscount: 0,
    ms2BurnDiscount: 0,
    levelDiscount: 0,
  });

  const fetchUserData = useCallback(async () => {
    if (!publicKey) return;

    try {
      setLoading(true);

      // Fetch experience
      const expResponse = await fetch('/api/getUserStats', {
        method: 'POST',
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { exp, points, doints, qoints } = await expResponse.json();

      // Fetch burns
      const burnsResponse = await fetch('/api/getUserBurns', {
        method: 'POST',
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { totalBurn } = await burnsResponse.json();

      // Fetch balance
      const balanceResponse = await fetch('/api/getMS2Balance', {
        method: 'POST',
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { balance } = await balanceResponse.json();

      const groupsResponse = await fetch(`/api/getGroups`, {
        method: 'POST',
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
        headers: { 'Content-Type': 'application/json' },
      });
      const groupsData = await groupsResponse.json();

      // Set the fetched user data into the state
      const fetchedUserInfo = {
        exp,
        burns: totalBurn,
        balance,
        points,
        doints,
        qoints,
        group: groupsData.groupChatDetails,
      };
      console.log('fetchedUserInfo', fetchedUserInfo);

      const solPriceResponse = await fetch(
        'https://api-v3.raydium.io/mint/price?mints=So11111111111111111111111111111111111111112',
      );
      const solData = await solPriceResponse.json();
      console.log('solPrice', solData.data['So11111111111111111111111111111111111111112']);

      setUserInfo(fetchedUserInfo);
      setSolPrice(parseFloat(solData.data['So11111111111111111111111111111111111111112']));

      // Calculate the discounts
      const calculatedDiscounts = calculateDiscounts(fetchedUserInfo);
      console.log('calculatedDiscounts', calculatedDiscounts);
      setDiscounts(calculatedDiscounts);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  return { userInfo, loading, discounts, solPrice, fetchUserData };
};
