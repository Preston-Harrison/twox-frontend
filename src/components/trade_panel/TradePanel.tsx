import classNames from 'classnames';
import { utils } from 'ethers';
import * as React from 'react';
import { useSigner } from 'wagmi';

import CallOrPut from './CallOrPut';
import TradeSelect from './TradeSelect';
import ChartHeader from '../chart/ChartHeader';
import DurationDropdown from '../DurationDropdown';
import Input from '../Input';
import { useServer } from '../../context/ServerContext';
import useOpenPosition from '../../hooks/useOpenPosition';
import { USD_TOKEN_DECIMALS } from '../../logic/contracts';
import { canParse } from '../../logic/utils';

export default function TradePanel() {
  const { sending, open } = useOpenPosition();
  const { data: signer } = useSigner();
  const { aggregators, aggregatorData } = useServer();

  // Inputs
  const [aggregator, setAggregator] = React.useState(aggregators[0]);
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
    <>
      <TradeSelect
        aggregator={aggregator}
        setAggregator={setAggregator}
        className='px-4'
      />
      <ChartHeader />
      <div className='row-span-2 flex h-full w-full flex-col gap-4 border-r border-coral-dark-grey bg-coral-blue p-4'>
        <CallOrPut value={isCall} onChange={setIsCall} />
        <Input
          value={deposit}
          onChange={setDeposit}
          label='Deposit'
          placeholder='0.0000'
          type='number'
        />

        <DurationDropdown duration={duration} onChange={setDuration} />

        <div></div>

        <button
          className={classNames(
            'w-full rounded-md py-2 text-white transition-all',
            {
              'bg-coral-green': isCall,
              'bg-coral-red': !isCall,
            }
          )}
          onClick={onSubmit}
        >
          Confirm {aggregatorData[aggregator].pair} {isCall ? 'call' : 'put'}
        </button>
      </div>
    </>
  );
}
