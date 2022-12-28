import { BigNumber, Signer } from 'ethers';
import React from 'react';

import useEnsureUsdAllowance from './useEnsureAllowance';
import useTransactionSender from './useTransactionSender';
import { LiquidityPool } from '../logic/contracts';

type AddLiquidityArgs = {
  signer: Signer;
  deposit: BigNumber;
};

export default function useAddLiquidity() {
  const { ensureAllowance } = useEnsureUsdAllowance();
  const { send } = useTransactionSender();
  const [sending, setSending] = React.useState(false);

  const addLiquidity = React.useCallback(
    async (args: AddLiquidityArgs) => {
      if (sending) throw new Error('Transaction already sending');
      try {
        setSending(true);
        const { signer, deposit } = args;
        await ensureAllowance(signer, LiquidityPool.address, deposit);
        const tx = LiquidityPool.connect(signer).deposit(
          deposit,
          signer.getAddress()
        );
        await send(tx);
      } finally {
        setSending(false);
      }
    },
    [ensureAllowance, send, sending]
  );

  return {
    addLiquidity,
    sending,
  };
}
