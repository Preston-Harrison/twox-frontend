import classNames from 'classnames';
import { utils } from 'ethers';
import * as React from 'react';
import { useSigner } from 'wagmi';

import AddRemoveToggle from './AddRemoveToggle';
import Input from '../Input';
import useAddLiquidity from '../../hooks/useAddLiquidity';
import useCachedPromise from '../../hooks/useCachedPromise';
import useRemoveLiquidity from '../../hooks/useRemoveLiquidity';
import { LiquidityPool, USD_TOKEN_DECIMALS } from '../../logic/contracts';
import { formatLpTokenAmount, formatTokenAmount } from '../../logic/format';
import { canParse } from '../../logic/utils';

type Props = {
  refresh: () => void;
};

export default function AddRemovePanel(props: Props) {
  const [amount, setAmount] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(true);
  const { data: signer } = useSigner();
  const { addLiquidity, sending: sendingAdd } = useAddLiquidity();
  const { removeLiquidity, sending: sendingRemove } = useRemoveLiquidity();

  const getLpOut = React.useCallback(
    async (deposit: string) => {
      if (!isAdding || deposit === '') return;
      return canParse(deposit, USD_TOKEN_DECIMALS)
        ? LiquidityPool.previewDeposit(
            utils.parseUnits(deposit, USD_TOKEN_DECIMALS)
          )
        : undefined;
    },
    [isAdding]
  );

  const getUsdTokenOut = React.useCallback(
    async (withdraw: string) => {
      if (isAdding || withdraw === '') return;
      return canParse(withdraw, USD_TOKEN_DECIMALS)
        ? LiquidityPool.previewRedeem(
            utils.parseUnits(withdraw, USD_TOKEN_DECIMALS)
          )
        : undefined;
    },
    [isAdding]
  );

  const { data: lpOut } = useCachedPromise(getLpOut, amount, 500);
  const { data: usdTokenOut } = useCachedPromise(getUsdTokenOut, amount, 500);

  const onSubmit = async () => {
    if (!signer) return alert('No signer');

    const value = utils.parseUnits(amount, USD_TOKEN_DECIMALS);
    if (isAdding) {
      await addLiquidity({
        signer,
        deposit: value,
      });
    } else {
      await removeLiquidity({
        signer,
        withdraw: value,
      });
    }
    setAmount('');
    props.refresh();
  };

  const error = (() => {
    if (!signer) {
      return `Connect wallet to ${isAdding ? 'add' : 'remove'} liquidity`;
    }
    if ((isAdding && sendingAdd) || (!isAdding && sendingRemove)) {
      return 'Transaction pending...';
    }
    if (amount === '' || +amount === 0) {
      return 'Enter an amount';
    }
    if (!canParse(amount, USD_TOKEN_DECIMALS)) {
      return 'Invalid amount';
    }
    return;
  })();

  return (
    <div className='flex flex-col gap-4 border border-coral-dark-grey p-4'>
      <AddRemoveToggle value={isAdding} onChange={setIsAdding} />
      <Input
        label='Amount'
        type='number'
        value={amount}
        onChange={setAmount}
        placeholder='0.0000'
      />
      <div className='w-full'>
        <div className='flex justify-between'>
          <div>You Receive</div>
          {isAdding && <div>{lpOut ? formatLpTokenAmount(lpOut) : '-'}</div>}
          {!isAdding && (
            <div>{usdTokenOut ? formatTokenAmount(usdTokenOut) : '-'}</div>
          )}
        </div>
        <div className='flex justify-between'>
          <div>Fees</div>
          <div>None</div>
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={!!error}
        className={classNames('w-full rounded-md p-2 transition-all', {
          'text-white hover:brightness-110': !error,
          'bg-coral-green': !error && isAdding,
          'bg-coral-red': !error && !isAdding,
          'bg-coral-dark-grey': !!error,
        })}
      >
        {error || (isAdding ? 'Add Liquidity' : 'Remove Liquidity')}
      </button>
    </div>
  );
}
