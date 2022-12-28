import { BigNumber, utils } from 'ethers';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAccount } from 'wagmi';

import WalletConnect from '../WalletConnect';
import { LP_TOKEN_SYMBOL, USD_TOKEN_DECIMALS } from '../../logic/contracts';
import { formatLpTokenAmount, formatTokenAmount } from '../../logic/format';

const PERCENTAGE_PRECISION = 4;

type Props = {
  totalSupply: BigNumber | undefined;
  totalAssets: BigNumber | undefined;
  apr: number | undefined;
  lpTokenBalance: BigNumber | undefined;
};

function LiquidityStats(props: Props) {
  const { totalSupply, totalAssets, apr, lpTokenBalance } = props;
  const { isConnected } = useAccount();

  const price =
    totalAssets &&
    totalSupply &&
    totalAssets.mul(utils.parseUnits('1', USD_TOKEN_DECIMALS)).div(totalSupply);

  const poolPercentageBn =
    lpTokenBalance &&
    totalSupply &&
    lpTokenBalance.mul(100 * 10 ** PERCENTAGE_PRECISION).div(totalSupply);

  return (
    <div className='flex flex-col border-y border-l border-coral-dark-grey p-4'>
      <div className='text-lg text-white'>
        {LP_TOKEN_SYMBOL} General Statistics
      </div>
      <div className='border-b border-coral-dark-grey pb-2'>
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
          <div>{apr !== undefined ? apr.toFixed(2) + '%' : '-'}</div>
        </div>
      </div>
      {isConnected && (
        <div>
          <div className='pt-2 text-lg text-white'>Account Details</div>
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
      {!isConnected && (
        <div className='flex flex-1 flex-col items-center justify-center pt-2'>
          <div className='w-4/5 text-center'>
            Connect your Ethereum wallet to see account statistics
          </div>
          <WalletConnect />
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(LiquidityStats), { ssr: false });
