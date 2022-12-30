import { BigNumber, Signer } from 'ethers';
import React from 'react';

import useEnsureUsdAllowance from './useEnsureAllowance';
import useTransactionSender from './useTransactionSender';
import { fetchSignedPrices } from '../logic/api';
import { Router } from '../logic/contracts';
import { encodeOpenPosition, encodeUpdateAggregator } from '../logic/encoding';

type OpenPositionArgs = {
  signer: Signer;
  deposit: BigNumber;
  aggregator: string;
  duration: number;
  isCall: boolean;
};

export default function useOpenPosition() {
  const { ensureAllowance } = useEnsureUsdAllowance();
  const { send } = useTransactionSender();
  const [sending, setSending] = React.useState(false);

  const open = async (args: OpenPositionArgs) => {
    setSending(true);
    try {
      const { signer, deposit, aggregator, duration, isCall } = args;
      await ensureAllowance(signer, Router.address, deposit);
      const prices = await fetchSignedPrices();
      const encodedAggregatorUpdate = encodeUpdateAggregator({
        address: aggregator,
        timestamp: prices.timestamp,
        answer: prices[aggregator].price,
        signature: prices[aggregator].signature,
        // TODO set min out, the below lets everything through
        acceptable: 0,
        isCall: false,
      });
      const encodedOpen = encodeOpenPosition({
        deposit,
        duration,
        isCall,
        aggregator,
      });
      const tx = Router.connect(signer).updateAggregatorsAndOpen(
        encodedAggregatorUpdate,
        encodedOpen
      );
      return await send(tx);
    } finally {
      setSending(false);
    }
  };

  return { open, sending };
}
