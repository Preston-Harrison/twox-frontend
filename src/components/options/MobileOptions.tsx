import classNames from 'classnames';
import { useAccount } from 'wagmi';

import MobileActiveOption from './MobileActiveOption';
import MobileClosedOption from './MobileClosedOption';
import { OptionProps } from './Options';

export default function MobileOptions(props: OptionProps) {
  const { tab, setTab, options, closedOptions } = props;
  const { isConnected } = useAccount();

  return (
    <div className='flex min-h-[25vh] flex-col laptop:hidden'>
      <div className='flex border-y border-coral-dark-grey'>
        <div
          className={classNames(
            'flex-1 border-r border-coral-dark-grey p-4 text-center transition-all',
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
          className={classNames('flex-1 p-4 text-center transition-all', {
            'bg-coral-dark-blue text-white': tab !== 'active',
            'cursor-pointer hover:bg-coral-dark-grey hover:text-white':
              tab === 'active',
          })}
          onClick={() => setTab('closed')}
        >
          Expired
        </div>
      </div>
      {tab === 'active' && (
        <>
          {options && (
            <div>
              {options.map((o) => (
                <MobileActiveOption option={o} key={o.id} />
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
          {closedOptions && (
            <div>
              {closedOptions.map((o) => (
                <MobileClosedOption option={o} key={o.id} />
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
