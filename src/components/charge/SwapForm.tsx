import { FC, useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUserData } from '@/hooks/useUserData';
import { calculatePointCost } from '@/utils/discountCalculations';
import createBalancedBar from '@/components/charge/pointsbar';
import Dropdown from './Dropdown';

const POINTMULTI = 540;
const NOCOINERSTARTER = 199800;

interface SwapFormProps {
    selectedService: any;
    setSelectedService: (value: any) => void;
  }

const SwapForm: FC<SwapFormProps> = ({ selectedService, setSelectedService }) => {
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [pointsAmount, setPointsAmount] = useState(0);
  const [pointsPerSol, setPointsPerSol] = useState<number>(0);

  const { publicKey } = useWallet();
  const { userInfo, loading, discounts, solPrice, fetchUserData } = useUserData(publicKey);
console.log('userInfo after useUserData', userInfo);
  const calculatePointsPerSol = useCallback(() => {
    if (discounts && solPrice) {
      console.log('discounts', discounts);
      const pointCostInUSD = calculatePointCost(discounts);
      console.log('pointcostusd', pointCostInUSD);
      const pointsPerSolCalc = solPrice / pointCostInUSD; // SOL to point conversion
      console.log('points per sol in calculate points per sol', pointsPerSolCalc);
      setPointsPerSol(pointsPerSolCalc);
    }
  }, [discounts, solPrice]);

  useEffect(() => {
    if (publicKey) {
      fetchUserData();
    }
  }, [publicKey, fetchUserData]);

  useEffect(() => {
    if (userInfo && solPrice) {
      calculatePointsPerSol();
    }
  }, [userInfo, solPrice, calculatePointsPerSol]);

  useEffect(() => {
    if (cryptoAmount && pointsPerSol) {
      setPointsAmount(cryptoAmount * pointsPerSol); // Update points after pointsPerSol is updated
    }
  }, [cryptoAmount, pointsPerSol]);

  const handleCryptoAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);
    setCryptoAmount(amount); // Simply update cryptoAmount, points will be calculated via useEffect
  };

  const canCharge = userInfo !== null;

  return (
    <>
      <h1 className="text-2xl font-bold text-center">⚡️⚡️ Charge your ⭐️STB🕶️ Account ⚡️⚡️</h1>
      <h2 className="text-2xl font-bold text-center">with 1-time-use points</h2>
      <br />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="spinner-border animate-spin text-white inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : !canCharge ? (
        <div className="text-center">
          <p className="text-red-500 font-bold mb-2">Account Not Found</p>
          <p className="text-white">You need to create an STB account before charging.</p>
          <p className="text-white">Please visit our <a href="https://t.me/STATIONTHIS" target="_blank" rel="noopener noreferrer">TG</a> to get started!</p>
        </div>
      ) : (
        <>
        {userInfo?.group && (
            <Dropdown selectedService={selectedService} setSelectedService={setSelectedService} />
          )}
          <br></br>
        <div className="flex flex-col text-white justify-center h-full text-left">
            {selectedService.id === 1 ? (
              <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p><strong>MS2 Balance: </strong>{userInfo.balance}🎮</p>
                        <p style={{ color: 'green', textAlign: 'right' }}>
                            {discounts && discounts.ms2BalanceDiscount ? `-${discounts.ms2BalanceDiscount}%` : ''}
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p><strong>MS2 Burned: </strong>{userInfo.burns || 0}🔥</p>
                        <p style={{ color: 'green', textAlign: 'right' }}>
                            {discounts && discounts.ms2BurnDiscount ? `-${discounts.ms2BurnDiscount}%` : ''}
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p><strong>Level: </strong>{Math.floor(Math.cbrt(userInfo.exp))}</p>
                        <p style={{ color: 'green', textAlign: 'right' }}>
                            {discounts && discounts.levelDiscount ? `-${discounts.levelDiscount}%` : ''}
                        </p>
                    </div>
                    {/* Level Progress Bar */}
                      <p><strong>EXP: </strong>{(() => {
                              const totalExp = userInfo.exp + userInfo.points;
                              const level = Math.floor(Math.cbrt(totalExp));
                              const nextLevel = (level + 1) ** 3;
                              const lastLevel = level ** 3;
                              const toLevelUpRatio = (totalExp - lastLevel) / (nextLevel - lastLevel);

                              let bars = '🟩';
                              for (let i = 0; i < 6; i++) {
                                  bars += i < toLevelUpRatio * 6 ? '🟩' : '⬜️';
                              }

                              return bars;
                          })()}</p>


                      {/* Points Progress Bar */}
                      <p><strong>Points: </strong>{createBalancedBar(
                            Math.floor((userInfo.balance + NOCOINERSTARTER) / POINTMULTI),
                            userInfo.points + userInfo.doints,
                            userInfo.qoints,
                            7
                            )}</p>
                      
                      <p>{Math.floor(userInfo.points + userInfo.doints)}/{Math.floor((userInfo.balance + userInfo.burns*2 + NOCOINERSTARTER) / POINTMULTI)}{ userInfo.qoints + pointsAmount > 0 ?  `+ ${Math.floor(userInfo.qoints + pointsAmount)}` : ''}</p>
                      </>) : (
              <>
                <p><strong>Group Name: </strong>{userInfo.group?.name}</p>
                <p><strong>Group Level: </strong>{Math.floor(Math.cbrt(userInfo.group?.points)) || 0} </p>
                <p><strong>EXP: </strong>{(() => {
                              const totalExp = userInfo.exp + userInfo.points;
                              const level = Math.floor(Math.cbrt(totalExp));
                              const nextLevel = (level + 1) ** 3;
                              const lastLevel = level ** 3;
                              const toLevelUpRatio = (totalExp - lastLevel) / (nextLevel - lastLevel);

                              let bars = '🟩';
                              for (let i = 0; i < 6; i++) {
                                  bars += i < toLevelUpRatio * 6 ? '🟩' : '⬜️';
                              }

                              return bars;
                          })()}</p>
                
                <p><strong>Group Point Balance Available:</strong> {userInfo.group?.qoints}</p>
                <p><strong>Points: </strong>{createBalancedBar(
                            0,
                            0,
                            userInfo.group?.qoints,
                            7
                            )}</p>
                      
                      <p>{ userInfo.group?.qoints  > 0 ?  `${Math.floor(userInfo.group?.qoints + pointsAmount)}` : 0}</p>
              </>
            )}
                  </div>
                </>
              )}
              <br></br>
              { discounts && discounts.ms2BalanceDiscount + discounts.ms2BurnDiscount + discounts.levelDiscount > 0 ? <><p style={{ color: 'green', textAlign: 'center' }}><strong>-{discounts.ms2BalanceDiscount + discounts.ms2BurnDiscount + discounts.levelDiscount}% DISCOUNT</strong></p></> : null }
              <br></br>
              {/* <h3 className={''}>Your rate: ${calculatePointCost(discounts)} / point </h3> */}
              <h3 className={''}>Your rate: {pointsPerSol} point / SOL</h3>
      <br />
      {/* User Input for Crypto Amount */}
      <div className="mt-4">
        <label className="block mb-2 text-sm">Sell (Enter SOL amount):</label>
        <input
          id="solInputAmount"
          type="number"
          value={cryptoAmount}
          onChange={handleCryptoAmountChange}
          className={`w-full p-2 text-black ${!canCharge ? 'bg-gray-200' : ''}`}
          disabled={!canCharge}
        />
      </div>
      {/* Points Amount Input */}
      <div className="mt-4">
        <label className="block mb-2 text-sm">Buy (Points you get):</label>
        <input
          type="number"
          value={pointsAmount}
          disabled
          className="w-full p-2 text-black bg-gray-200"
        />
      </div>
    </>
  );
};

export default SwapForm;
