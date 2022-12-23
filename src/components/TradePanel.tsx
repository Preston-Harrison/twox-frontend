import { utils } from 'ethers';
import * as React from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { useSigner } from 'wagmi';

import DurationDropdown from './DurationDropdown';
import TradeDropdown from './TradeDropdown';
import { useServer } from '../context/ServerContext';
import useOpenPosition from '../hooks/useOpenPosition';
import { USD_TOKEN_DECIMALS } from '../logic/contracts';
import { canParse } from '../logic/utils';

export default function TradePanel() {
  const { sending, open } = useOpenPosition();
  const { data: signer } = useSigner();
  const { aggregators } = useServer();

  // Inputs
  const [aggregator, setAggregator] = React.useState(
    Object.keys(aggregators)[0]
  );
  const [duration, setDuration] = React.useState(5 * 60);
  const [isCall, setIsCall] = React.useState(true);
  const [deposit, setDeposit] = React.useState('');

  const onSubmit = async () => {
    if (sending) return alert('Wait');
    if (!signer) return alert('Connect');

    if (!canParse(deposit, USD_TOKEN_DECIMALS)) {
      return alert('Invalid deposit');
    }

    const depositBn = utils.parseUnits(deposit, USD_TOKEN_DECIMALS);
    open({
      deposit: depositBn,
      aggregator,
      duration,
      isCall,
      signer,
    });
  };

  return (
    <div className='flex h-full w-full flex-col gap-2 bg-blue-100 p-4'>
      <TradeDropdown aggregator={aggregator} setAggregator={setAggregator} />
      <DurationDropdown duration={duration} onChange={setDuration} />

      <ButtonGroup>
        <Button
          variant={isCall ? 'success' : 'secondary'}
          onClick={() => setIsCall(true)}
        >
          Call
        </Button>
        <Button
          variant={!isCall ? 'danger' : 'secondary'}
          onClick={() => setIsCall(false)}
        >
          Put
        </Button>
      </ButtonGroup>

      <Form.Group>
        <Form.Label>Deposit</Form.Label>
        <Form.Control
          placeholder='Deposit Amount'
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />
      </Form.Group>

      <Button className='w-full' onClick={onSubmit}>
        Confirm Trade
      </Button>
    </div>
  );
}
