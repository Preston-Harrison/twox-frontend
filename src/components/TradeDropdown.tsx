import classnames from 'classnames';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { Button } from 'react-bootstrap';

import { useServer } from '../context/ServerContext';
import useCheckOutsideClick from '../hooks/useCheckOutsideClick';
import { oracleToUsd } from '../logic/format';

type Props = {
  aggregator: string;
  setAggregator: (a: string) => void;
};

function TradeDropdown(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { aggregators, prices, aggregatorToPair } = useServer();
  const { aggregator, setAggregator } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  useCheckOutsideClick(ref, close);

  return (
    <div className='relative w-full' ref={ref}>
      <Button onClick={() => setOpen(!open)} className='w-full'>
        {aggregatorToPair[aggregator]} ({oracleToUsd(prices[aggregator])})
      </Button>
      <div
        className={classnames('absolute z-10 w-full', {
          hidden: !open,
        })}
      >
        {aggregators
          .filter((a) => a !== aggregator)
          .map((a) => {
            return (
              <button
                onClick={() => {
                  setAggregator(a);
                  close();
                }}
                key={a}
                className='w-full bg-white p-2 hover:!bg-gray-200'
              >
                {aggregatorToPair[a]} ({oracleToUsd(prices[a])})
              </button>
            );
          })}
      </div>
    </div>
  );
}

// make it not SSR
export default dynamic(() => Promise.resolve(TradeDropdown), { ssr: false });
