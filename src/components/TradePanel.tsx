import { BigNumber } from 'ethers';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

import DurationDropdown from './DurationDropdown';
import TradeDropdown from './TradeDropdown';

type Props = {
  aggregator: string;
  setAggregator: (a: string) => void;
  duration: number;
  setDuration: (d: number) => void;
  isCall: boolean;
  setIsCall: (c: boolean) => void;
};

export default function TradePanel(props: Props) {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      BigNumber.from(data.deposit);
    } catch (e) {
      return alert('Invalid deposit');
    }
  };
  return (
    <div>
      <div className='col-span-1 flex w-full flex-col gap-2 bg-blue-100 p-4'>
        <TradeDropdown
          activeAggregator={props.aggregator}
          setActiveAggregator={props.setAggregator}
        />
        <DurationDropdown
          duration={props.duration}
          onChange={props.setDuration}
        />
        <Form.Group className='w-min'>
          <Form.Label>Call?</Form.Label>
          <Form.Control
            type='checkbox'
            checked={props.isCall}
            onChange={() => props.setIsCall(!props.isCall)}
          />
        </Form.Group>
        <Form onSubmit={onSubmit} className='flex flex-col gap-2'>
          <Form.Group>
            <Form.Label>Deposit</Form.Label>
            <Form.Control placeholder='Deposit Amount' name='deposit' />
          </Form.Group>
          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}
