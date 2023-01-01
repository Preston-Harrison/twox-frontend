import classnames from 'classnames';

import AggregatorIcon from './AggregatorIcon';
import { OPTION_DIFF_SHOW_THRESHOLD } from '../config';
import { useAggregator } from '../context/AggregatorContext';
import { Option } from '../context/MarketContext';
import { useServer } from '../context/ServerContext';
import { formatOraclePrice, formatTokenAmount } from '../logic/format';
import { calculateDelta, isInTheMoney } from '../logic/utils';

const headerSpacing = `w-full grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_2fr] gap-2 px-4 py-2 items-center`;
const headers = [
  <div key='Asset'>Asset</div>,
  <div key='Current Price'>Close Price</div>,
  <div key='Open Price'>Open Price</div>,
  <div key='Deposit'>Deposit</div>,
  <div key='Payout'>Payout</div>,
  <div key='PnL'>PnL</div>,
  <div key='Expiry'>Expiry</div>,
];

type Props = {
  option: Option;
};

export default function ClosedOption(props: Props) {
  const { option } = props;
  const { aggregatorData } = useServer();
  const { aggregator, setAggregator } = useAggregator();

  const inTheMoney = isInTheMoney(option, +option.closePrice);
  const expiryTimestamp = new Date(option.expiry * 1000);

  const pair = aggregatorData[option.aggregator].pair;

  const diff = calculateDelta(+option.openPrice, +option.closePrice);
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
          'text-coral-red': diff <= 0,
        })}
      >
        <div>{formatOraclePrice(option.closePrice, pair)} </div>
        <div className='text-sm'>
          {diff !== 0 &&
            Math.abs(diff) > OPTION_DIFF_SHOW_THRESHOLD &&
            `${diffDisplay} from open price`}
          {diff !== 0 &&
            Math.abs(diff) < OPTION_DIFF_SHOW_THRESHOLD &&
            `<${OPTION_DIFF_SHOW_THRESHOLD * 100}% from open price`}
          {diff === 0 && 'Same as open price'}
        </div>
      </div>
      <div>{formatOraclePrice(option.openPrice, pair)}</div>
      <div>{formatTokenAmount(option.deposit)}</div>
      <div
        className={classnames({
          'text-coral-green': inTheMoney,
          'text-coral-red': !inTheMoney,
        })}
      >
        {formatTokenAmount(inTheMoney ? option.payout : 0)}
      </div>
      <div
        className={classnames('font-bold', {
          'text-coral-green': inTheMoney,
          'text-coral-red': !inTheMoney,
        })}
      >
        {inTheMoney && '+'}
        {formatTokenAmount(
          inTheMoney
            ? option.payout.sub(option.deposit)
            : option.deposit.mul(-1)
        )}
      </div>
      <div>
        <div>
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

export function ClosedOptionHeaders() {
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
