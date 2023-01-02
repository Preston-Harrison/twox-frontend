import classnames from 'classnames';
import { useTimer } from 'react-timer-hook';

import AggregatorIcon from '../AggregatorIcon';
import { OPTION_DIFF_SHOW_THRESHOLD } from '../../config';
import { useAggregator } from '../../context/AggregatorContext';
import { Option } from '../../context/MarketContext';
import { useServer } from '../../context/ServerContext';
import { formatOraclePrice, formatTokenAmount } from '../../logic/format';
import { calculateDelta, isInTheMoney } from '../../logic/utils';

type Props = {
  option: Option;
};

const headerSpacing = `w-full grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_2fr] gap-2 px-4 py-2 items-center`;
const headers = [
  <div key='Asset'>Asset</div>,
  <div key='Current Price'>Current Price</div>,
  <div key='Open Price'>Open Price</div>,
  <div key='Deposit'>Deposit</div>,
  <div key='Payout'>Payout</div>,
  <div key='Status'>Status</div>,
  <div key='Expiry'>Expiry</div>,
];

export default function ActiveOption(props: Props) {
  const { option } = props;
  const { aggregatorData, prices } = useServer();
  const { aggregator, setAggregator } = useAggregator();

  const expiryTimestamp = new Date(option.expiry * 1000);
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
  });
  const expiryDisplay =
    option.expiry * 1000 > Date.now()
      ? `${hours}h ${minutes}m ${seconds}s`
      : 'closing soon...';

  const inTheMoney = isInTheMoney(option, +prices[option.aggregator]);

  const pair = aggregatorData[option.aggregator].pair;

  const diff = calculateDelta(+option.openPrice, +prices[option.aggregator]);
  const diffDisplay = `${diff > 0 ? '+' : ''}${(+diff * 100).toFixed(2)}%`;

  const onClick = () => {
    setAggregator(option.aggregator);
  };

  return (
    <div className={headerSpacing}>
      <div
        className={classnames('flex items-center gap-2', {
          'cursor-pointer': aggregator !== option.aggregator,
        })}
        onClick={onClick}
      >
        <AggregatorIcon aggregator={option.aggregator} className='h-[32px]' />
        <div>{pair}</div>
        <div
          className={classnames(
            'whitespace-nowrap rounded-md bg-coral-dark-grey px-1 text-sm',
            {
              'text-coral-green': option.isCall,
              'text-coral-red': !option.isCall,
            }
          )}
        >
          {option.isCall ? 'Call ▲' : 'Put ▼'}
        </div>
      </div>
      <div
        className={classnames({
          'text-coral-green': diff > 0,
          'text-coral-red': diff < 0,
        })}
      >
        <div>{formatOraclePrice(prices[option.aggregator], pair)} </div>
        <div className='text-sm'>
          {Math.abs(diff) > OPTION_DIFF_SHOW_THRESHOLD &&
            `${diffDisplay} from open price`}
          {Math.abs(diff) < OPTION_DIFF_SHOW_THRESHOLD &&
            `<${OPTION_DIFF_SHOW_THRESHOLD * 100}% from open price`}
        </div>
      </div>
      <div>{formatOraclePrice(option.openPrice, pair)}</div>
      <div>{formatTokenAmount(option.deposit)}</div>
      <div
        className={classnames({
          'text-coral-green': inTheMoney,
          'text-coral-red': !inTheMoney && diff !== 0,
        })}
      >
        <div className='font-bold'>{formatTokenAmount(option.payout)}</div>
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
    </div>
  );
}

export function ActiveOptionHeaders() {
  return (
    <div
      className={classnames(
        headerSpacing,
        'border-y border-coral-dark-grey bg-coral-dark-blue'
      )}
    >
      {headers}
    </div>
  );
}
