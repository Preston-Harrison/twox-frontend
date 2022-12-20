import { utils } from 'ethers';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSigner } from 'wagmi';

import DurationDropdown from './DurationDropdown';
import TradeDropdown from './TradeDropdown';
import useEnsureUsdAllowance from '../hooks/useEnsureAllowance';
import useTransactionSender from '../hooks/useTransactionSender';
import { fetchSignedPrices } from '../logic/api';
import { Router, USD_TOKEN_DECIMALS } from '../logic/contracts';
import { encodeOpenPosition, encodeUpdateAggregator } from '../logic/encoding';

type Props = {
  aggregator: string;
  setAggregator: (a: string) => void;
  duration: number;
  setDuration: (d: number) => void;
  isCall: boolean;
  setIsCall: (c: boolean) => void;
};

export default function TradePanel(props: Props) {
  const { sending, send } = useTransactionSender();
  const { data: signer } = useSigner();
  const ensureAllowance = useEnsureUsdAllowance();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (sending) return alert('Wait');
    if (!signer) return alert('Connect');
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;

    try {
      utils.parseUnits(data.deposit, USD_TOKEN_DECIMALS);
    } catch (e) {
      return alert('Invalid deposit');
    }
    const deposit = utils.parseUnits(data.deposit, USD_TOKEN_DECIMALS);

    await ensureAllowance(signer, Router.address, deposit);
    const prices = await fetchSignedPrices();
    const encodedAggregatorUpdate = encodeUpdateAggregator({
      address: props.aggregator,
      timestamp: prices.timestamp,
      answer: prices[props.aggregator].price,
      signature: prices[props.aggregator].signature,
      // TODO set min out, the below lets everything through
      acceptable: 0,
      isCall: false,
    });
    const encodedOpen = encodeOpenPosition({
      deposit,
      duration: props.duration,
      isCall: props.isCall,
      priceFeed: props.aggregator,
    });
    const tx = Router.connect(signer).updateAggregatorsAndOpen(
      encodedAggregatorUpdate,
      encodedOpen
    );
    await send(tx);
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
