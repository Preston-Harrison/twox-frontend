import classNames from 'classnames';
import { useAccount } from 'wagmi';

import ActiveOption, { ActiveOptionHeaders } from './ActiveOption';
import ClosedOption, { ClosedOptionHeaders } from './ClosedOption';
import { OptionProps } from './Options';

export default function DesktopOptions(props: OptionProps) {
  const { tab, setTab, options, closedOptions } = props;
  const { isConnected } = useAccount();

  return (
    <div className='flex min-h-[25%] flex-col border-t border-coral-dark-grey bg-coral-blue max-laptop:hidden'>
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
          Expired
        </div>
      </div>
      {tab === 'active' && (
        <>
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
              Connect wallet to see active options
            </div>
          )}
        </>
      )}
      {tab === 'closed' && (
        <>
          <ClosedOptionHeaders />
          {closedOptions && (
            <div>
              {[...closedOptions]
                .sort((a, b) => b.expiry - a.expiry)
                .map((o) => (
                  <ClosedOption option={o} key={o.id} />
                ))}
            </div>
          )}
          {closedOptions?.length === 0 && (
            <div className='flex flex-1 items-center justify-center'>
              You have no expired options
            </div>
          )}
          {!isConnected && (
            <div className='flex flex-1 items-center justify-center'>
              Connect wallet to see expired options
            </div>
          )}
        </>
      )}
    </div>
  );
}
