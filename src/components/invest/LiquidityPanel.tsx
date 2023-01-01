import React from 'react';
import { useAccount } from 'wagmi';

import AddRemovePanel from './AddRemovePanel';
import LiquidityStats from './LiquidityStats';
import { EXCHANGE_NAME } from '../../config';
import usePromise from '../../hooks/usePromise';
import { LiquidityPool, USD_TOKEN_SYMBOL } from '../../logic/contracts';

export default function LiquidityPanel() {
  const { address } = useAccount();

  const fetchLiquidityTokenBalance = React.useCallback(async () => {
    if (!address) return;
    return LiquidityPool.balanceOf(address);
  }, [address]);

  const { data: lpTokenBalance, refresh: refreshLpBalance } = usePromise(
    fetchLiquidityTokenBalance
  );
  const { data: totalSupply, refresh: refreshTotalSupply } = usePromise(
    LiquidityPool.totalSupply
  );
  const { data: totalAssets, refresh: refreshTotalAssets } = usePromise(
    LiquidityPool.totalAssets
  );

  const refreshAll = () => {
    refreshLpBalance();
    refreshTotalSupply();
    refreshTotalAssets();
  };

  return (
    <div className='w-[60%] min-w-[40%] max-w-[900px]'>
      <div className='my-4'>
        <div className='w-full text-3xl'>Invest</div>
        <div>
          Buy shares of the {EXCHANGE_NAME} liquidity pool to earn{' '}
          {USD_TOKEN_SYMBOL} when traders lose or pay fees
        </div>
      </div>
      <div className='grid grid-cols-2'>
        <LiquidityStats
          lpTokenBalance={lpTokenBalance}
          totalAssets={totalAssets}
          totalSupply={totalSupply}
        />
        <AddRemovePanel refresh={refreshAll} />
      </div>
    </div>
  );
}
