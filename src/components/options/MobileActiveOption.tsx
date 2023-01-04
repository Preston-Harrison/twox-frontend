import classnames from 'classnames';
import React from 'react';
import { useTimer } from 'react-timer-hook';

import AggregatorIcon from '../AggregatorIcon';
import { Option } from '../../context/MarketContext';
import { useServer } from '../../context/ServerContext';
import { formatOraclePrice, formatTokenAmount } from '../../logic/format';
import { calculateDelta, isInTheMoney } from '../../logic/utils';

type Props = {
  option: Option;
};

export default function MobileActiveOption(props: Props) {
  const { option } = props;
  const { aggregator, isCall, expiry, openPrice } = option;
  const { aggregatorData, prices } = useServer();
  const pair = aggregatorData[aggregator].pair;
  const inTheMoney = isInTheMoney(props.option, +prices[aggregator]);

  const [showDetails, setShowDetails] = React.useState(false);

  const expiryTimestamp = new Date(expiry * 1000);
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
  });
  const expiryDisplay =
    expiry * 1000 > Date.now()
      ? `${hours}h ${minutes}m ${seconds}s`
      : 'closing soon...';

  const diff = calculateDelta(+option.openPrice, +prices[option.aggregator]);
  const diffDisplay = `${diff > 0 ? '+' : ''}${(+diff * 100).toFixed(2)}%`;

  return (
    <div className='m-4 rounded-lg border border-coral-dark-grey bg-coral-dark-blue p-4'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <AggregatorIcon aggregator={aggregator} className='h-[32px]' />
          <div className='text-xl'>{aggregatorData[aggregator].pair}</div>
          <div
            className={classnames(
              'whitespace-nowrap rounded-md bg-coral-dark-grey px-1 text-sm',
              {
                'text-coral-green': isCall,
                'text-coral-red': !isCall,
              }
            )}
          >
            {isCall ? 'Call ▲' : 'Put ▼'}
          </div>
        </div>
        <div
          className={classnames(
            'flex w-max items-center whitespace-nowrap rounded-md bg-coral-dark-grey px-2',
            {
              'text-coral-green': inTheMoney,
              'text-coral-red': !inTheMoney,
            }
          )}
        >
          <div className='mr-2'>{inTheMoney ? 'Winning' : 'Losing'}</div>
          <div className='text-2xl'>{inTheMoney ? '✓' : '𐄂'}</div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div>
          <div>{expiryDisplay}</div>
          <div className='text-coral-grey'>
            {expiryTimestamp.toLocaleDateString(undefined)}{' '}
            {expiryTimestamp.toLocaleString(undefined, {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </div>
        </div>
        <button
          className='rounded-md bg-coral-dark-grey px-4 py-2'
          onClick={() => setShowDetails(!showDetails)}
        >
          Info {showDetails ? '▲' : '▼'}
        </button>
      </div>
      <div className={classnames('pt-4', { hidden: !showDetails })}>
        <div className='flex justify-between'>
          <div>Current Price</div>
          <div
            className={classnames({
              'text-coral-green': diff > 0,
              'text-coral-red': diff < 0,
            })}
          >
            {formatOraclePrice(prices[aggregator], pair)}{' '}
            {diff !== 0 && `(${diffDisplay})`}
          </div>
        </div>
        <div className='flex justify-between'>
          <div>Open Price</div>
          <div>{formatOraclePrice(openPrice, pair)}</div>
        </div>
        <div className='flex justify-between'>
          <div>Deposit</div>
          <div>{formatTokenAmount(option.deposit, true)}</div>
        </div>
        <div className='flex justify-between'>
          <div>Payout</div>
          <div
            className={classnames({
              'text-coral-green': inTheMoney,
              'text-coral-red': !inTheMoney && diff !== 0,
            })}
          >
            {formatTokenAmount(option.payout, true)}
          </div>
        </div>
      </div>
    </div>
  );
}
