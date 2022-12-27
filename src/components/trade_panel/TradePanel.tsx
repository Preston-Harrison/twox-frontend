import classNames from 'classnames';
import { ConnectKitButton } from 'connectkit';
import { utils } from 'ethers';
import * as React from 'react';
import { useSigner } from 'wagmi';

import CallOrPut from './CallOrPut';
import DurationDropdown from './DurationDropdown';
import TradeSelect from './TradeSelect';
import ChartHeader from '../chart/ChartHeader';
import Input from '../Input';
import { MARKET_PRECISION } from '../../config';
import { useAggregator } from '../../context/AggregatorContext';
import { useServer } from '../../context/ServerContext';
import useCachedPromise from '../../hooks/useCachedPromise';
import useOpenPosition from '../../hooks/useOpenPosition';
import { Market, USD_TOKEN_DECIMALS } from '../../logic/contracts';
import { numToToken } from '../../logic/format';
import { popup } from '../../logic/notifications';
import { canParse } from '../../logic/utils';

export default function TradePanel() {
  const { sending, open } = useOpenPosition();
  const { data: signer } = useSigner();
  const { aggregatorData } = useServer();
  const { aggregator } = useAggregator();

  // Inputs
  const [duration, setDuration] = React.useState(5 * 60);
  const [isCall, setIsCall] = React.useState(true);
  const [deposit, setDeposit] = React.useState('');

  // Fetching
  const fetchConfig = React.useCallback(async (address: string) => {
    const config = await Market.aggregatorConfig(address);
    return config;
  }, []);
  const { data: config } = useCachedPromise(fetchConfig, aggregator);

  // Config parsing
  const payout = config && config.payoutMultiplier / MARKET_PRECISION;
  const feeFraction = config && config.feeFraction / MARKET_PRECISION;
  const feePercentageDisplay =
    feeFraction && feeFraction > 0
      ? `(${(feeFraction * 100).toFixed(2)}%)`
      : 'None';
  const feeAbsoluteDisplay =
    (feeFraction || 0) > 0 &&
    canParse(deposit, USD_TOKEN_DECIMALS) &&
    (+deposit * feeFraction!).toFixed(2);

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
      <TradeSelect className='px-4' />
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

        <div className='flex w-full flex-col'>
          <div className='flex justify-between'>
            <div>Fees</div>
            <div>
              {feeAbsoluteDisplay} {feePercentageDisplay || '-'}
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

        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show }) => {
            if (isConnected) {
              return (
                <button
                  className={classNames(
                    'w-full rounded-md py-2 transition-all',
                    {
                      'text-white': !noDeposit,
                      'bg-coral-green': !noDeposit && isCall,
                      'bg-coral-red': !noDeposit && !isCall,
                      'bg-coral-dark-grey text-coral-light-grey': noDeposit,
                    }
                  )}
                  onClick={onSubmit}
                  disabled={noDeposit}
                >
                  {noDeposit ? 'Enter a deposit' : submitText}
                </button>
              );
            }
            return (
              <button
                onClick={show}
                className='w-full rounded-md bg-coral-dark-grey py-2 hover:brightness-110'
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
    </>
  );
}
