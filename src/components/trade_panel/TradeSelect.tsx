import classnames from 'classnames';
import dynamic from 'next/dynamic';
import * as React from 'react';

import AggregatorIcon from '../AggregatorIcon';
import { useAggregator } from '../../context/AggregatorContext';
import { useHistoricPrice } from '../../context/HistoricPriceContext';
import { useServer } from '../../context/ServerContext';
import useCheckOutsideClick from '../../hooks/useCheckOutsideClick';
import { formatOraclePrice } from '../../logic/format';
import { calculateDelta } from '../../logic/utils';

type Props = {
  className?: string;
};

function TradeSelect(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { aggregators, aggregatorData, prices } = useServer();
  const { aggregator, setAggregator } = useAggregator();
  const { data: historic } = useHistoricPrice();
  const ref = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  useCheckOutsideClick(ref, close);

  const buttonWidth = ref.current?.clientWidth;
  const buttonHeight = ref.current?.clientHeight;

  return (
    <div className='w-full bg-coral-blue' ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={classnames(
          'flex h-full w-full items-center justify-between border-b-[1px] border-coral-dark-grey text-lg',
          props.className
        )}
      >
        {!open && (
          <>
            <div className='flex items-center gap-2'>
              <AggregatorIcon aggregator={aggregator} className='h-[32px]' />
              <div>{aggregatorData[aggregator].pair}</div>
            </div>
            <div className='text-sm'>All markets ▼</div>
          </>
        )}
        {open && (
          <>
            <div>Select market</div>
            <div className='text-sm'>Close ▲</div>
          </>
        )}
      </button>
      <div
        className={classnames('absolute z-10 h-full bg-coral-blue', {
          hidden: !open,
        })}
        style={{ width: buttonWidth }}
      >
        {aggregators.map((a) => {
          const delta =
            historic[a] && calculateDelta(historic[a]!.open * 1e8, +prices[a]);
          return (
            <button
              onClick={() => {
                setAggregator(a);
                close();
              }}
              key={a}
              className={classnames(
                'flex w-full items-center justify-between border-b-[1px] border-coral-dark-grey px-4 text-lg',
                {
                  'bg-coral-dark-blue': a === aggregator,
                }
              )}
              style={{ height: buttonHeight }}
            >
              <div className='flex items-center gap-2'>
                <AggregatorIcon aggregator={a} className='h-[32px]' />
                <div>{aggregatorData[a].pair}</div>
              </div>
              <div className='flex flex-col items-end'>
                <div>
                  {formatOraclePrice(prices[a], aggregatorData[a].pair)}
                </div>
                {delta && (
                  <div
                    className={classnames('text-sm', {
                      'text-coral-green': delta > 0,
                      'text-coral-red': delta < 0,
                    })}
                  >
                    {delta > 0 ? '+' : ''}
                    {(delta * 100).toFixed(2)}%
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// make it not SSR
export default dynamic(() => Promise.resolve(TradeSelect), { ssr: false });
