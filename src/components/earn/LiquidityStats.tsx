import { utils } from 'ethers';
import React from 'react';
import { useAccount } from 'wagmi';

import usePromise from '../../hooks/usePromise';
import {
  LiquidityPool,
  LP_TOKEN_SYMBOL,
  USD_TOKEN_DECIMALS,
} from '../../logic/contracts';
import { formatLpTokenAmount, formatTokenAmount } from '../../logic/format';

const PERCENTAGE_PRECISION = 4;

export default function LiquidityStats() {
  const { address, isConnected } = useAccount();

  const fetchLiquidityTokenBalance = React.useCallback(async () => {
    if (!address) return;
    return LiquidityPool.balanceOf(address);
  }, [address]);

  const { data: lpTokenBalance } = usePromise(fetchLiquidityTokenBalance);
  const { data: totalSupply } = usePromise(LiquidityPool.totalSupply);
  const { data: totalAssets } = usePromise(LiquidityPool.totalAssets);
  const price =
    totalAssets &&
    totalSupply &&
    totalAssets.mul(utils.parseUnits('1', USD_TOKEN_DECIMALS)).div(totalSupply);

  const poolPercentageBn =
    lpTokenBalance &&
    totalSupply &&
    lpTokenBalance.mul(100 * 10 ** PERCENTAGE_PRECISION).div(totalSupply);

  return (
    <div className='border-y border-l border-coral-dark-grey p-4'>
      <div className='text-lg text-white'>
        {LP_TOKEN_SYMBOL} General Statistics
      </div>
      <div>
        <div className='flex justify-between'>
          <div>Total supply</div>
          <div>
            {totalSupply ? formatLpTokenAmount(totalSupply, true) : '-'}
          </div>
        </div>
        <div className='flex justify-between'>
          <div>Total assets</div>
          <div>{totalAssets ? formatTokenAmount(totalAssets, true) : '-'}</div>
        </div>
        <div className='flex justify-between'>
          <div>Price</div>
          <div>{price ? formatTokenAmount(price, true) : '-'}</div>
        </div>
        <div className='flex justify-between'>
          <div>APR</div>
          <div>todo</div>
        </div>
      </div>
      {isConnected && (
        <div>
          <div className='mt-2 text-lg text-white'>Account Details</div>
          <div className='flex justify-between'>
            <div>Balance</div>
            <div>
              {lpTokenBalance ? formatLpTokenAmount(lpTokenBalance) : '-'}
            </div>
          </div>
          <div className='flex justify-between'>
            <div>Credited Assets</div>
            <div>
              {lpTokenBalance && price
                ? formatTokenAmount(
                    lpTokenBalance
                      .mul(price)
                      .div(utils.parseUnits('1', USD_TOKEN_DECIMALS))
                  )
                : '-'}
            </div>
          </div>
          <div className='flex justify-between'>
            <div>Pool Percentage</div>
            <div>
              {poolPercentageBn
                ? `${(
                    +poolPercentageBn /
                    10 ** PERCENTAGE_PRECISION
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: PERCENTAGE_PRECISION,
                  })}%`
                : '-'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
