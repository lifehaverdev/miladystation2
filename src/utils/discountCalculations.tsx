interface UserInfo {
    balance: number;
    burns: number;
    exp: number;
  }
  
  interface Discounts {
    ms2BalanceDiscount: number;
    ms2BurnDiscount: number;
    levelDiscount: number;
  }
  
  export const calculateDiscounts = (userInfo: UserInfo): Discounts => {
    const { balance, burns, exp } = userInfo;
  
    // Discount based on MS2 balance (25% discount if balance >= 600,000)
    const ms2BalanceDiscount = balance >= 6000000 ? 25 : (balance / 600000) * 25;
  
    // Discount based on MS2 burned (25% discount if burned >= 300,000)
    const ms2BurnDiscount = burns >= 300000 ? 25 : (burns / 300000) * 25;
  
    // Discount based on user level (25% discount if level >= 100)
    const userLevel = Math.floor(Math.cbrt(exp));
    const levelDiscount = userLevel >= 100 ? 25 : (userLevel / 100) * 25;
  
    return {
      ms2BalanceDiscount: Math.min(ms2BalanceDiscount, 25),  // Ensure max 25%
      ms2BurnDiscount: Math.min(ms2BurnDiscount, 25),        // Ensure max 25%
      levelDiscount: Math.min(levelDiscount, 25),            // Ensure max 25%
    };
  };
  
  export const calculatePointCost = (discounts: Discounts): number => {
    const baseCostPerPoint = 0.01; // Base cost for the user with no discounts
    if (!discounts) {
      console.log('NO DISCOUNTS FOUND');
      return baseCostPerPoint;
    }
  
    // Calculate the total discount by summing the three discount types
    const totalDiscount = (discounts.ms2BalanceDiscount || 0) + (discounts.ms2BurnDiscount || 0) + (discounts.levelDiscount || 0);
  
    // Cap the total discount at 75% (if total discount exceeds 75)
    const effectiveDiscount = Math.min(totalDiscount, 75);
    console.log('effectiveDiscount', effectiveDiscount);
  
    // Calculate the final cost per point by applying the discount to the base cost
    const discountedCostPerPoint = baseCostPerPoint * (1 - effectiveDiscount / 100);
    console.log('discountedCostPerPoint', discountedCostPerPoint);
  
    return discountedCostPerPoint;
  };
  