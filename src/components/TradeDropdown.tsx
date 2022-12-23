import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

import { useServer } from '../context/ServerContext';
import { oracleToUsd } from '../logic/format';

type Props = {
  aggregator: string;
  setAggregator: (a: string) => void;
};

export default function TradeDropdown(props: Props) {
  const { aggregators, prices } = useServer();
  const { aggregator, setAggregator } = props;

  return (
    <div className='w-full'>
      <Dropdown>
        <Dropdown.Toggle
          variant='primary'
          id='trade-dropdown'
          className='w-full'
        >
          {aggregators[aggregator]} ({oracleToUsd(prices[aggregator])})
        </Dropdown.Toggle>

        <Dropdown.Menu className='w-full'>
          {Object.entries(aggregators).map(([a, p]) => {
            return (
              a !== aggregator && (
                <Dropdown.Item
                  onClick={() => setAggregator(a)}
                  key={a}
                  as='button'
                >
                  {p} ({oracleToUsd(prices[a])})
                </Dropdown.Item>
              )
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
