import { BigNumber, Signer } from 'ethers';
import React from 'react';

import useTransactionSender from './useTransactionSender';
import { LiquidityPool } from '../logic/contracts';

type RemoveLiquidityArgs = {
  signer: Signer;
  withdraw: BigNumber;
};

export default function useRemoveLiquidity() {
  const { send, sending } = useTransactionSender();

  const removeLiquidity = React.useCallback(
    async (args: RemoveLiquidityArgs) => {
      const { signer, withdraw } = args;
      const tx = LiquidityPool.connect(signer).redeem(
        withdraw,
        signer.getAddress(),
        signer.getAddress()
      );
      await send(tx);
    },
    [send]
  );

  return {
    removeLiquidity,
    sending,
  };
}
