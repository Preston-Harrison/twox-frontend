import classnames from 'classnames';
import classNames from 'classnames';
import * as React from 'react';

import AggregatorIcon from '../AggregatorIcon';
import { FAVORITE_PAIR_KEY } from '../../config';
import { useAggregator } from '../../context/AggregatorContext';
import { useHistoricPrice } from '../../context/HistoricPriceContext';
import { useMarket } from '../../context/MarketContext';
import { useServer } from '../../context/ServerContext';
import useCheckOutsideClick from '../../hooks/useCheckOutsideClick';
import useIsFirstRender from '../../hooks/useIsFirstRender';
import useLocalStorage from '../../hooks/useLocalStorage';
import { formatOraclePrice } from '../../logic/format';
import { calculateDelta } from '../../logic/utils';

type Props = {
  className?: string;
};

export default function TradeSelect(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { aggregators, aggregatorData, prices } = useServer();
  const { aggregator, setAggregator } = useAggregator();
  const { data: historic } = useHistoricPrice();
  const isFirstRender = useIsFirstRender();
  const { aggregatorConfig } = useMarket();

  const [isFavoritePair, setIsFavoritePair] = useLocalStorage<
    Record<string, boolean>
  >(FAVORITE_PAIR_KEY, {});

  const onClickFavorite =
    (pair: string) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsFavoritePair({
        ...isFavoritePair,
        [pair]: !isFavoritePair[pair],
      });
    };

  const ref = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  useCheckOutsideClick(ref, close);

  const buttonWidth = ref.current?.clientWidth;
  const buttonHeight = ref.current?.clientHeight;

  const favoritesToTop = [...aggregators].sort((a, b) => {
    const pairA = aggregatorData[a].pair;
    const pairB = aggregatorData[b].pair;
    if (isFavoritePair[pairA] === isFavoritePair[pairB]) return 0;
    if (isFavoritePair[pairA] && !isFavoritePair[pairB]) return -1;
    return 1;
  });

  // SSR reasons
  const showFavoritePair = (aggregator: string) => {
    return isFavoritePair[aggregatorData[aggregator].pair] && !isFirstRender;
  };

  return (
    <div className='w-full bg-coral-blue' ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={classnames(
          'flex h-full w-full items-center justify-between border-b-[1px] border-coral-dark-grey text-lg max-laptop:h-[60px]',
          props.className
        )}
      >
        {!open && (
          <>
            <div className='flex items-center gap-2'>
              <AggregatorIcon aggregator={aggregator} className='h-[32px]' />
              <div>{aggregatorData[aggregator].pair}</div>
            </div>
            <div className='text-sm'>All markets ???</div>
          </>
        )}
        {open && (
          <>
            <div>Select market</div>
            <div className='text-sm'>Close ???</div>
          </>
        )}
      </button>
      <div
        className={classnames('absolute bg-coral-blue transition-opacity', {
          '-z-10 hidden opacity-0': !open,
          'z-10': open,
        })}
        style={{
          width: (buttonWidth || 0) - 2,
          height: `calc(100% - ${buttonHeight || 0}px)`,
        }}
      >
        {favoritesToTop.map((a) => {
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
                'flex w-full items-center justify-between border-b-[1px] border-coral-dark-grey px-4 text-lg transition-all',
                {
                  'bg-coral-dark-blue': a === aggregator,
                  'hover:bg-coral-dark-grey hover:text-white': a !== aggregator,
                }
              )}
              style={{ height: buttonHeight }}
            >
              <div className='flex items-center gap-2'>
                <div
                  className={classNames(
                    'cursor-pointer text-2xl transition-all',
                    {
                      'text-orange-300 hover:text-orange-200':
                        showFavoritePair(a),
                      'text-coral-light-grey hover:text-white':
                        !showFavoritePair(a),
                    }
                  )}
                  onClick={onClickFavorite(aggregatorData[a].pair)}
                >
                  {showFavoritePair(a) ? '???' : '???'}
                </div>
                <AggregatorIcon
                  aggregator={a}
                  className='max-laptop:h-[24px] laptop:h-[32px]'
                />
                <div className='flex flex-col items-start'>
                  <div className='max-laptop:text-sm'>
                    {aggregatorData[a].pair}
                  </div>
                  {aggregatorConfig && (
                    <div className='text-sm'>
                      {(aggregatorConfig[a].payoutMultiplier / 10_000).toFixed(
                        2
                      )}
                      x
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col items-end max-laptop:text-sm'>
                <div>
                  {formatOraclePrice(prices[a], aggregatorData[a].pair)}
                </div>
                <div className='text-sm'>
                  {delta && (
                    <div
                      className={classnames({
                        'text-coral-green': delta > 0,
                        'text-coral-red': delta < 0,
                      })}
                    >
                      {delta > 0 ? '+' : ''}
                      {(delta * 100).toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
