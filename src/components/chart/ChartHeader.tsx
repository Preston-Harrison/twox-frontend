import classnames from 'classnames';

import { useAggregator } from '../../context/AggregatorContext';
import { useHistoricPrice } from '../../context/HistoricPriceContext';
import { useServer } from '../../context/ServerContext';
import { formatOraclePrice } from '../../logic/format';
import { calculateDelta } from '../../logic/utils';

export default function ChartHeader() {
  const { data: historic } = useHistoricPrice();
  const { aggregator } = useAggregator();
  const { aggregatorData, prices } = useServer();

  const pair = aggregatorData[aggregator].pair;
  const data = historic[aggregator];
  const price = prices[aggregator];

  if (!data) return null; // TODO

  const delta = calculateDelta(data.open * 1e8, +price);
  const deltaDisplay = `${(delta * 100).toFixed(2)}%`;

  const deltaNum = +price - data.open * 1e8;

  return (
    <div className='flex  items-center border-b border-coral-dark-grey bg-coral-blue'>
      <div className='flex h-2/3 items-center gap-4 border-x border-coral-dark-grey px-4 text-xl text-white'>
        <div>{formatOraclePrice(price, pair)}</div>
        <div
          className={classnames('text-base', {
            'text-coral-green': delta > 0,
            'text-coral-red': delta < 0,
          })}
        >
          {delta < 0 ? `${deltaDisplay}` : `+${deltaDisplay}`}
        </div>
      </div>
      <div className='flex h-2/3 flex-col items-start justify-center border-r border-coral-dark-grey px-4'>
        <div className='text-sm text-coral-light-grey'>24hr Change</div>
        <div
          className={classnames({
            'text-coral-green': deltaNum > 0,
            'text-coral-red': deltaNum < 0,
          })}
        >
          {deltaNum > 0 ? '+' : ''}
          {formatOraclePrice(deltaNum, pair)}
        </div>
      </div>
      <div className='flex h-2/3 flex-col items-start justify-center border-r border-coral-dark-grey px-4'>
        <div className='text-sm text-coral-light-grey'>24hr Low</div>
        <div>{formatOraclePrice(data.low * 1e8, pair)}</div>
      </div>
      <div className='flex h-2/3 flex-col items-start justify-center border-r border-coral-dark-grey px-4'>
        <div className='text-sm text-coral-light-grey'>24hr High</div>
        <div>{formatOraclePrice(data.high * 1e8, pair)}</div>
      </div>
    </div>
  );
}
