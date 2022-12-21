import { BigNumber, Signer } from 'ethers';

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
  const { ensureAllowance, sending: sendingAllowance } =
    useEnsureUsdAllowance();
  const { send, sending } = useTransactionSender();

  const open = async (args: OpenPositionArgs) => {
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
    await send(tx);
  };

  return { open, sending: sending || sendingAllowance };
}
