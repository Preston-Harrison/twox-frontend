import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';

import ActiveOption, { ActiveOptionHeaders } from './ActiveOption';
import { useMarket } from '../context/MarketContext';

function Options() {
  const { options } = useMarket();
  const { isConnected } = useAccount();
  return (
    <div className='flex min-h-[25%] flex-col border-t border-coral-dark-grey bg-coral-blue'>
      <ActiveOptionHeaders />
      {options && (
        <div>
          {options.map((o) => (
            <ActiveOption option={o} key={o.id} />
          ))}
        </div>
      )}
      {options?.length === 0 && (
        <div className='flex flex-1 items-center justify-center'>
          You have no active options
        </div>
      )}
      {!isConnected && (
        <div className='flex flex-1 items-center justify-center'>
          Connect wallet to see options
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Options), { ssr: false });
