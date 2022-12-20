import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

import { useServer } from '../context/ServerContext';

type Props = {
  activeAggregator: string;
  setActiveAggregator: (a: string) => void;
};

export default function TradeDropdown(props: Props) {
  const { aggregators } = useServer();
  return (
    <div className='w-full'>
      <Dropdown>
        <Dropdown.Toggle
          variant='success'
          id='trade-dropdown'
          className='w-full'
        >
          {aggregators[props.activeAggregator]}
        </Dropdown.Toggle>

        <Dropdown.Menu className='w-full'>
          {Object.entries(aggregators).map(([a, p]) => {
            return (
              a !== props.activeAggregator && (
                <Dropdown.Item
                  onClick={() => props.setActiveAggregator(a)}
                  key={a}
                >
                  {p}
                </Dropdown.Item>
              )
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
