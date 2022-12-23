import { utils } from 'ethers';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAccount, useSigner } from 'wagmi';

import useEnsureUsdAllowance from '../hooks/useEnsureAllowance';
import usePromise from '../hooks/usePromise';
import useTransactionSender from '../hooks/useTransactionSender';
import {
  LiquidityPool,
  USD_TOKEN_DECIMALS,
  USD_TOKEN_SYMBOL,
} from '../logic/contracts';
import { canParse } from '../logic/utils';

export default function LiquidityPanel() {
  const [deposit, setDeposit] = React.useState('');
  const { send, sending } = useTransactionSender();
  const { ensureAllowance, sending: allowanceSending } =
    useEnsureUsdAllowance();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const getLpOut = React.useCallback(async () => {
    return canParse(deposit, USD_TOKEN_DECIMALS)
      ? LiquidityPool.previewDeposit(
          utils.parseUnits(deposit, USD_TOKEN_DECIMALS)
        )
      : undefined;
  }, [deposit]);

  const { data: lpOut } = usePromise(getLpOut, 500);

  const onSubmit = async () => {
    if (sending || allowanceSending) return alert('still sending, please wait');
    if (!signer || !address) return alert('No signer');
    if (!canParse(deposit, USD_TOKEN_DECIMALS)) {
      return alert('Invalid deposit');
    }
    const depositBn = utils.parseUnits(deposit, USD_TOKEN_DECIMALS);
    await ensureAllowance(signer, LiquidityPool.address, depositBn);
    const tx = LiquidityPool.connect(signer).deposit(depositBn, address);
    await send(tx);
  };

  return (
    <div className='border-2 border-red-400 p-4'>
      <Form.Group>
        <Form.Label>Deposit {USD_TOKEN_SYMBOL}</Form.Label>
        <Form.Control
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          className='w-full'
        />
      </Form.Group>
      <div className='my-2'>
        Receive LP: {lpOut && utils.formatUnits(lpOut, USD_TOKEN_DECIMALS)}
      </div>
      <Button onClick={onSubmit} disabled={!signer} className='w-full'>
        {signer ? 'Submit' : 'Connect Wallet'}
      </Button>
    </div>
  );
}
