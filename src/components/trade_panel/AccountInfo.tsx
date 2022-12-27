import { BigNumber, ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { useAccount, useEnsName } from 'wagmi';

import WalletConnect from '../WalletConnect';
import { useBalance } from '../../context/BalanceContext';
import { useMarket } from '../../context/MarketContext';
import { useServer } from '../../context/ServerContext';
import { formatTokenAmount } from '../../logic/format';
import { isInTheMoney, truncateAddress } from '../../logic/utils';

type Props = {
  depositBn: BigNumber;
};

function AccountInfo(props: Props) {
  const { depositBn } = props;
  const { address } = useAccount();
  const { data: ens } = useEnsName({ address });
  const { options } = useMarket();
  const { prices } = useServer();

  const locked = options?.reduce((acc, curr) => {
    return acc.add(curr.deposit);
  }, ethers.constants.Zero);

  const expectedPayout = options?.reduce((acc, curr) => {
    if (isInTheMoney(curr, +prices[curr.aggregator])) {
      return acc.add(curr.payout);
    }
    return acc;
  }, ethers.constants.Zero);

  const { usdTokenBalance } = useBalance();

  if (!address) {
    return (
      <div className='flex h-36 w-full flex-col items-center justify-center border-b border-coral-dark-grey p-4'>
        <div className='mx-auto mb-2 w-3/4 text-center'>
          Connect your Ethereum wallet to start trading.
        </div>
        <WalletConnect className='mx-auto' />
      </div>
    );
  }

  return (
    <div className='flex h-36 flex-col justify-center border-b border-coral-dark-grey p-4 text-sm'>
      <div>
        <div className='mb-2 flex w-full items-center justify-between text-base font-bold'>
          <div>Account</div>
          <div>{ens || truncateAddress(address)}</div>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div>Balance</div>
          <div>
            {usdTokenBalance ? (
              depositBn.isZero() ? (
                formatTokenAmount(usdTokenBalance, true)
              ) : (
                <>
                  {formatTokenAmount(usdTokenBalance, true)}{' '}
                  <span className='text-coral-red'>→</span>{' '}
                  {formatTokenAmount(usdTokenBalance.sub(depositBn), true)}
                </>
              )
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div>Locked Deposits</div>
          <div>
            {locked ? (
              depositBn.isZero() ? (
                formatTokenAmount(locked, true)
              ) : (
                <>
                  {formatTokenAmount(locked, true)}{' '}
                  <span className='text-coral-green'>→</span>{' '}
                  {formatTokenAmount(locked.add(depositBn), true)}
                </>
              )
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div>Total In The Money</div>
          <div>{expectedPayout ? formatTokenAmount(expectedPayout) : '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AccountInfo), { ssr: false });
