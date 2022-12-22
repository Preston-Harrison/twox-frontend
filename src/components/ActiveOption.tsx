import classnames from 'classnames';
import { useTimer } from 'react-timer-hook';
import { useSigner } from 'wagmi';

import { Option } from '../context/MarketContext';
import { useServer } from '../context/ServerContext';
import useTransactionSender from '../hooks/useTransactionSender';
import { fetchSignedPrices } from '../logic/api';
import { Router } from '../logic/contracts';
import { encodeUpdateAggregator } from '../logic/encoding';
import { oracleToUsd, tokenToUsd } from '../logic/format';

type Props = {
  option: Option;
};

const headerSpacing = 'w-full grid grid-cols-8 px-2';

export default function ActiveOption(props: Props) {
  const { option } = props;
  const { aggregators, prices } = useServer();
  const { data: signer } = useSigner();
  const { send } = useTransactionSender();

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(option.expiry * 1000),
  });
  const expiryDisplay =
    option.expiry * 1000 > Date.now()
      ? `${hours}h ${minutes}m ${seconds}s`
      : 'closing soon...';

  const close = async () => {
    if (!signer) return alert('No signer');
    const prices = await fetchSignedPrices();
    const encodedAggregatorUpdate = encodeUpdateAggregator({
      address: option.aggregator,
      timestamp: prices.timestamp,
      answer: prices[option.aggregator].price,
      signature: prices[option.aggregator].signature,
      // TODO set min out, the below lets everything through
      acceptable: 0,
      isCall: false,
    });
    const tx = Router.connect(signer).updateAggregatorsAndClose(
      encodedAggregatorUpdate,
      [option.id]
    );
    await send(tx);
  };

  const inTheMoney = option.isCall
    ? +option.closePrice > +option.openPrice
    : +option.closePrice < +option.openPrice;

  return (
    <div
      className={classnames(headerSpacing, 'cursor-pointer hover:bg-gray-100')}
      onClick={close}
    >
      <div>{aggregators[option.aggregator]}</div>
      <div>{option.isCall ? 'Call' : 'Put'}</div>
      <div>{oracleToUsd(option.openPrice)}</div>
      <div>{oracleToUsd(prices[option.aggregator])}</div>
      <div>{tokenToUsd(option.deposit)}</div>
      <div>{tokenToUsd(option.payout)}</div>
      <div>{expiryDisplay}</div>
      <div>{inTheMoney ? 'In the money' : 'Out of the money'}</div>
    </div>
  );
}

export function ActiveOptionHeaders() {
  return (
    <div className={headerSpacing}>
      <div>Asset</div>
      <div>Type</div>
      <div>Open Price</div>
      <div>Current Price</div>
      <div>Deposit</div>
      <div>Payout</div>
      <div>Expiry</div>
      <div>Status</div>
    </div>
  );
}
