import classnames from 'classnames';

import { useAggregator } from '../context/AggregatorContext';
import { useHistoricPrice } from '../context/HistoricPriceContext';
import { useServer } from '../context/ServerContext';
import usePrevious from '../hooks/usePrevious';
import { formatOraclePrice } from '../logic/format';
import { calculateDelta } from '../logic/utils';

export default function ChartHeader() {
  const { data: historic } = useHistoricPrice();
  const { aggregator } = useAggregator();
  const { aggregatorData, prices } = useServer();

  const pair = aggregatorData[aggregator].pair;
  const data = historic[aggregator];
  const price = prices[aggregator];

  const previousPrice = usePrevious(price);
  const canShowTrend = previousPrice !== undefined && +previousPrice !== +price;

  if (!data) return <div></div>; // TODO

  const delta = calculateDelta(data.open * 1e8, +price);
  const deltaDisplay = `${(delta * 100).toFixed(2)}%`;

  const deltaNum = +price - data.open * 1e8;

  return (
    <div className='flex items-center border-b border-coral-dark-grey bg-coral-blue py-4 max-laptop:text-sm laptop:w-max'>
      <div className='flex h-full flex-[0.75] items-center gap-4 border-r border-coral-dark-grey px-4 laptop:border-l laptop:text-xl'>
        <div
          className={classnames('text-white laptop:w-max', {
            '!text-coral-green': canShowTrend
              ? +previousPrice < +price
              : delta > 0,
            '!text-coral-red': canShowTrend
              ? +previousPrice > +price
              : delta < 0,
          })}
        >
          {formatOraclePrice(price, pair)}
        </div>
      </div>
      <div className='flex h-full flex-[1.5] flex-col items-start justify-center border-r border-coral-dark-grey px-4'>
        <div className='text-sm text-coral-light-grey'>24hr Change</div>
        <div
          className={classnames('laptop:w-max', {
            'text-coral-green': deltaNum > 0,
            'text-coral-red': deltaNum < 0,
          })}
        >
          {deltaNum > 0 ? '+' : ''}
          {formatOraclePrice(deltaNum, pair)} (
          {delta < 0 ? deltaDisplay.slice(1) : deltaDisplay})
        </div>
      </div>
      <div className='flex h-full flex-1 flex-col items-start justify-center border-r border-coral-dark-grey px-4'>
        <div className='text-sm text-coral-light-grey'>24hr Low</div>
        <div>{formatOraclePrice(data.low * 1e8, pair)}</div>
      </div>
      <div className='flex h-full flex-1 flex-col items-start justify-center border-coral-dark-grey px-4 laptop:border-r'>
        <div className='text-sm text-coral-light-grey'>24hr High</div>
        <div>{formatOraclePrice(data.high * 1e8, pair)}</div>
      </div>
    </div>
  );
}
