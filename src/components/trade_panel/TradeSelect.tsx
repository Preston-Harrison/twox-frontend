import classnames from 'classnames';
import dynamic from 'next/dynamic';
import * as React from 'react';

import { useServer } from '../../context/ServerContext';
import useCheckOutsideClick from '../../hooks/useCheckOutsideClick';

type Props = {
  aggregator: string;
  setAggregator: (a: string) => void;
  className?: string;
};

function TradeSelect(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { aggregators, aggregatorData } = useServer();
  const { aggregator, setAggregator } = props;
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
            <div>{aggregatorData[aggregator].pair}</div>
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
          return (
            <button
              onClick={() => {
                setAggregator(a);
                close();
              }}
              key={a}
              className='flex w-full items-center justify-between border-b-[1px] border-coral-dark-grey px-4 text-lg'
              style={{ height: buttonHeight }}
            >
              {aggregatorData[a].pair}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// make it not SSR
export default dynamic(() => Promise.resolve(TradeSelect), { ssr: false });
