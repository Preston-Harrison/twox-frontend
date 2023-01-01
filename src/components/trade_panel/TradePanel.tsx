import classNames from 'classnames';
import { ethers, utils } from 'ethers';
import * as React from 'react';
import { useSigner } from 'wagmi';

import AccountInfo from './AccountInfo';
import CallOrPut from './CallOrPut';
import DurationSelect from './DurationSelect';
import TradeSelect from './TradeSelect';
import Input from '../Input';
import ChartHeader from '../PriceHeader';
import { DURATIONS, MARKET_PRECISION } from '../../config';
import { useAggregator } from '../../context/AggregatorContext';
import { useBalance } from '../../context/BalanceContext';
import { useMarket } from '../../context/MarketContext';
import { useServer } from '../../context/ServerContext';
import useOpenPosition from '../../hooks/useOpenPosition';
import { USD_TOKEN_DECIMALS } from '../../logic/contracts';
import { formatTokenAmount, numToToken } from '../../logic/format';
import { popup } from '../../logic/notifications';
import { canParse } from '../../logic/utils';

export default function TradePanel() {
  const { sending, open } = useOpenPosition();
  const { data: signer } = useSigner();
  const { aggregatorData } = useServer();
  const { aggregator } = useAggregator();
  const { usdTokenBalance } = useBalance();
  const { aggregatorConfig } = useMarket();

  // Inputs
  const [duration, setDuration] = React.useState(DURATIONS[0].duration);
  const [isCall, setIsCall] = React.useState(true);
  const [deposit, setDeposit] = React.useState('');

  // Fetching
  const config = aggregatorConfig?.[aggregator];

  // Config parsing
  const payout = config && config.payoutMultiplier / MARKET_PRECISION;
  const feeFraction = config && config.feeFraction / MARKET_PRECISION;
  const feePercentageDisplay =
    feeFraction && feeFraction > 0 ? `(${feeFraction * 100}%)` : 'None';
  const feeAbsoluteDisplay =
    (feeFraction || 0) > 0 &&
    canParse(deposit, USD_TOKEN_DECIMALS) &&
    +deposit * feeFraction!;

  const onSubmit = async () => {
    if (sending) return popup('Current transaction still pending', 'info');
    if (!signer) return popup('Connect wallet to trade', 'info');

    const depositBn = utils.parseUnits(deposit, USD_TOKEN_DECIMALS);
    const tx = await open({
      deposit: depositBn,
      aggregator,
      duration,
      isCall,
      signer,
    });
    if (tx) {
      setDeposit('');
    }
  };

  const submitText = `Confirm ${aggregatorData[aggregator].pair} ${
    isCall ? 'call' : 'put'
  }`;

  const error = (() => {
    if (!signer) return 'Connect wallet to trade';
    if (sending) return 'Confirming trade...';
    if (deposit === '' || +deposit === 0) return 'Enter a deposit';
    if (!canParse(deposit, USD_TOKEN_DECIMALS)) return 'Invalid deposit';
    if (
      usdTokenBalance &&
      utils.parseUnits(deposit, USD_TOKEN_DECIMALS).gt(usdTokenBalance)
    ) {
      return 'Balance too low';
    }
    if (
      config?.minimumDeposit &&
      utils.parseUnits(deposit, USD_TOKEN_DECIMALS).lt(config.minimumDeposit)
    ) {
      return `Minimum deposit is ${formatTokenAmount(config.minimumDeposit)}`;
    }
  })();

  return (
    <>
      <TradeSelect className='px-4' />
      <ChartHeader />
      <div className='row-span-2 border-r border-coral-dark-grey bg-coral-blue'>
        <div className='mb-4'>
          <AccountInfo
            depositBn={
              canParse(deposit, USD_TOKEN_DECIMALS)
                ? utils.parseUnits(deposit, USD_TOKEN_DECIMALS)
                : ethers.constants.Zero
            }
            feeBn={config?.feeFraction}
          />
        </div>
        <div className='flex w-full flex-col gap-4 px-4'>
          <CallOrPut value={isCall} onChange={setIsCall} />
          <Input
            value={deposit}
            onChange={setDeposit}
            label='Deposit'
            placeholder='0.0000'
            type='number'
            disabled={sending}
          />

          <DurationSelect duration={duration} onChange={setDuration} />

          <div className='flex w-full flex-col text-sm'>
            <div className='flex justify-between'>
              <div>Fees</div>
              <div>
                {numToToken(+feeAbsoluteDisplay)} {feePercentageDisplay || '-'}
              </div>
            </div>
            <div className='flex justify-between'>
              <div>Payout</div>
              <div>
                {payout
                  ? `${numToToken(
                      +deposit * (1 - (feeFraction || 0)) * payout
                    )} (${payout.toFixed(2)}x)`
                  : '-'}
              </div>
            </div>
          </div>
          <button
            className={classNames('w-full rounded-md py-2 transition-all', {
              'text-white': !error,
              'bg-coral-green': !error && isCall,
              'bg-coral-red': !error && !isCall,
              'cursor-not-allowed bg-coral-dark-grey text-coral-light-grey':
                error,
            })}
            onClick={onSubmit}
            disabled={!!error}
          >
            {error || submitText}
          </button>
        </div>
      </div>
    </>
  );
}
