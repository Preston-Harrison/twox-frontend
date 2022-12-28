import React from 'react';
import { useAccount } from 'wagmi';

import AddRemovePanel from './AddRemovePanel';
import LiquidityStats from './LiquidityStats';
import usePromise from '../../hooks/usePromise';
import { getLpTokenApr } from '../../logic/complexCalls';
import { LiquidityPool } from '../../logic/contracts';

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

  const fetchApr = React.useCallback(async () => {
    if (!totalAssets || !totalSupply) return;
    return getLpTokenApr(7 * 24 * 60 * 60, totalSupply, totalAssets);
  }, [totalAssets, totalSupply]);

  const { data: apr, refresh: refreshApr } = usePromise(fetchApr);

  const refreshAll = () => {
    refreshLpBalance();
    refreshTotalSupply();
    refreshTotalAssets();
	refreshApr();
  };

  return (
    <div className='grid w-[60%] min-w-[40%] max-w-[900px] grid-cols-2'>
      <LiquidityStats
        apr={apr}
        lpTokenBalance={lpTokenBalance}
        totalAssets={totalAssets}
        totalSupply={totalSupply}
      />
      <AddRemovePanel refresh={refreshAll} />
    </div>
  );
}
