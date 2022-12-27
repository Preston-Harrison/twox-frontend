import classNames from 'classnames';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAccount } from 'wagmi';

import ActiveOption, { ActiveOptionHeaders } from './ActiveOption';
import ClosedOption, { ClosedOptionHeaders } from './ClosedOption';
import { useMarket } from '../context/MarketContext';
import usePromise from '../hooks/usePromise';
import { getClosedOptions } from '../logic/multicalls';

function Options() {
  const [tab, setTab] = React.useState<'active' | 'closed'>('active');
  const { options } = useMarket();
  const { isConnected, address } = useAccount();

  const fetchClosed = React.useCallback(async () => {
    if (!address) return;
    return getClosedOptions(address);
  }, [address]);

  const { data: closedOptions, refresh } = usePromise(fetchClosed, 500);

  React.useEffect(() => {
    refresh();
  }, [options, refresh]);

  return (
    <div className='flex min-h-[25%] flex-col border-t border-coral-dark-grey bg-coral-blue'>
      <div className='flex py-1'>
        <div
          className={classNames(
            'border-r border-coral-dark-grey px-4 transition-all',
            {
              'bg-coral-dark-blue text-white': tab === 'active',
              'cursor-pointer hover:bg-coral-dark-grey hover:text-white':
                tab !== 'active',
            }
          )}
          onClick={() => setTab('active')}
        >
          Active
        </div>
        <div
          className={classNames(
            'border-r border-coral-dark-grey px-4 transition-all',
            {
              'bg-coral-dark-blue text-white': tab !== 'active',
              'cursor-pointer hover:bg-coral-dark-grey hover:text-white':
                tab === 'active',
            }
          )}
          onClick={() => setTab('closed')}
        >
          Closed
        </div>
      </div>
      {tab === 'active' && (
        <div>
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
      )}
      {tab === 'closed' && (
        <div>
          <ClosedOptionHeaders />
          {closedOptions && (
            <div>
              {closedOptions.map((o) => (
                <ClosedOption option={o} key={o.id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Options), { ssr: false });
