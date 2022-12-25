import classNames from 'classnames';
import { utils } from 'ethers';
import * as React from 'react';
import { useSigner } from 'wagmi';

import CallOrPut from './CallOrPut';
import TradeSelect from './TradeSelect';
import ChartHeader from '../chart/ChartHeader';
import DurationDropdown from '../DurationDropdown';
import Input from '../Input';
import { MARKET_PRECISION } from '../../config';
import { useBalance } from '../../context/BalanceContext';
import { useHistoricPrice } from '../../context/HistoricPriceContext';
import { useServer } from '../../context/ServerContext';
import useCachedPromise from '../../hooks/useCachedPromise';
import useOpenPosition from '../../hooks/useOpenPosition';
import { Market, USD_TOKEN_DECIMALS } from '../../logic/contracts';
import { formatTokenAmount, numToToken } from '../../logic/format';
import { popup } from '../../logic/notifications';
import { canParse } from '../../logic/utils';

export default function TradePanel() {
  const { sending, open } = useOpenPosition();
  const { data: signer } = useSigner();
  const { aggregators, aggregatorData } = useServer();
  const { usdTokenBalance } = useBalance();
  useHistoricPrice();

  // Inputs
  const [aggregator, setAggregator] = React.useState(aggregators[0]);
  const [duration, setDuration] = React.useState(5 * 60);
  const [isCall, setIsCall] = React.useState(true);
  const [deposit, setDeposit] = React.useState('');

  // Fetching
  const fetchPayout = React.useCallback(async (address: string) => {
    const config = await Market.aggregatorConfig(address);
    return config.payoutMultiplier / MARKET_PRECISION;
  }, []);

  const { data: payout } = useCachedPromise(fetchPayout, aggregator);

  const onSubmit = async () => {
    if (sending) return popup('Current transaction still pending', 'info');
    if (!signer) return popup('Connect wallet to trade', 'info');

    const depositBn = utils.parseUnits(deposit, USD_TOKEN_DECIMALS);
    open({
      deposit: depositBn,
      aggregator,
      duration,
      isCall,
      signer,
    });
  };

  const noDeposit = !canParse(deposit, USD_TOKEN_DECIMALS);
  const submitText = `Confirm ${aggregatorData[aggregator].pair} ${
    isCall ? 'call' : 'put'
  }`;

  return (
    <>
      <TradeSelect
        aggregator={aggregator}
        setAggregator={setAggregator}
        className='px-4'
      />
      <ChartHeader aggregator={aggregator} />
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

        <div className='flex w-full flex-col'>
          <div className='flex justify-between'>
            <div>Balance</div>
            <div>
              {usdTokenBalance ? formatTokenAmount(usdTokenBalance) : '-'}
            </div>
          </div>
          <div className='flex justify-between'>
            <div>Payout</div>
            <div>
              {payout
                ? `${numToToken(+deposit * payout)} (${payout.toFixed(2)}x)`
                : '-'}
            </div>
          </div>
          <div className='flex justify-between'>
            <div>Profit</div>
            <div>{payout ? `${numToToken(+deposit * (payout - 1))}` : '-'}</div>
          </div>
        </div>

        <button
          className={classNames('w-full rounded-md py-2  transition-all', {
            'text-white': !noDeposit,
            'bg-coral-green': !noDeposit && isCall,
            'bg-coral-red': !noDeposit && !isCall,
            'bg-coral-dark-grey text-coral-light-grey': noDeposit,
          })}
          onClick={onSubmit}
          disabled={noDeposit}
        >
          {noDeposit ? 'Enter a deposit' : submitText}
        </button>
      </div>
    </>
  );
}
