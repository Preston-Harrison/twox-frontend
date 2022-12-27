import { ContractCallContext, Multicall } from 'ethereum-multicall';
import { BigNumber, constants } from 'ethers';

import { provider } from './alchemy';
import { Market } from './contracts';
import { Option } from '../context/MarketContext';
import MarketAbi from '../contracts/abis/Market.json';

const multicall = new Multicall({
  ethersProvider: provider,
  tryAggregate: true,
});

export async function getOptions(ids: number[]): Promise<Option[]> {
  const context: ContractCallContext = {
    reference: 'Market',
    contractAddress: Market.address,
    abi: MarketAbi.abi,
    calls: ids.map((id) => ({
      reference: id.toString(),
      methodName: 'options',
      methodParameters: [id],
    })),
  };

  const { results } = await multicall.call(context);
  const options: Option[] = results.Market.callsReturnContext.map((call) => {
    return {
      id: call.methodParameters[0],
      aggregator: call.returnValues[0].toLowerCase(),
      expiry: +call.returnValues[1],
      isCall: call.returnValues[2],
      openPrice: BigNumber.from(call.returnValues[3]),
      closePrice: BigNumber.from(call.returnValues[4]),
      deposit: BigNumber.from(call.returnValues[5]),
      payout: BigNumber.from(call.returnValues[6]),
    };
  });

  return options;
}

export async function getClosedOptions(address: string) {
  const filter = Market.filters.Transfer(address, constants.AddressZero);
  const closedOptions = await Market.queryFilter(filter);
  const ids = closedOptions.map((o) => +o.args.tokenId);
  return getOptions(ids);
}
