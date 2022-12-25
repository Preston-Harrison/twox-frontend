import classnames from 'classnames';
import { useTimer } from 'react-timer-hook';
import { useSigner } from 'wagmi';

import { Option } from '../context/MarketContext';
import { useServer } from '../context/ServerContext';
import useTransactionSender from '../hooks/useTransactionSender';
import { fetchSignedPrices } from '../logic/api';
import { Router } from '../logic/contracts';
import { encodeUpdateAggregator } from '../logic/encoding';
import { formatOraclePrice, formatTokenAmount } from '../logic/format';
import { popup } from '../logic/notifications';

type Props = {
  option: Option;
};

const headerSpacing = 'w-full grid grid-cols-8 px-2';

export default function ActiveOption(props: Props) {
  const { option } = props;
  const { aggregatorData, prices } = useServer();
  const { data: signer } = useSigner();
  const { send } = useTransactionSender();

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(option.expiry * 1000),
  });
  const expiryDisplay =
    option.expiry * 1000 > Date.now()
      ? `${hours}h ${minutes}m ${seconds}s`
      : 'closing soon...';

  // TODO remove this function, it only exists so I don't have to pay
  // for an close execution server
  const close = async () => {
    if (!signer) return popup('connect wallet to close', 'info');
    const prices = await fetchSignedPrices();
    const encodedAggregatorUpdate = encodeUpdateAggregator({
      address: option.aggregator,
      timestamp: prices.timestamp,
      answer: prices[option.aggregator].price,
      signature: prices[option.aggregator].signature,
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
    ? +prices[option.aggregator] > +option.openPrice
    : +prices[option.aggregator] < +option.openPrice;

  const pair = aggregatorData[option.aggregator].pair;

  return (
    <div
      className={classnames(headerSpacing, 'cursor-pointer hover:bg-gray-100')}
      onClick={close}
    >
      <div>{pair}</div>
      <div>{option.isCall ? 'Call' : 'Put'}</div>
      <div>{formatOraclePrice(option.openPrice, pair)}</div>
      <div>{formatOraclePrice(prices[option.aggregator], pair)}</div>
      <div>{formatTokenAmount(option.deposit)}</div>
      <div>{formatTokenAmount(option.payout)}</div>
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
