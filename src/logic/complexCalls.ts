import { ContractCallContext, Multicall } from 'ethereum-multicall';
import { BigNumber, constants } from 'ethers';

import { provider } from './alchemy';
import { LiquidityPool, Market } from './contracts';
import { Option } from '../context/MarketContext';
import MarketAbi from '../contracts/abis/Market.json';

const multicall = new Multicall({
  ethersProvider: provider,
  tryAggregate: true,
});

export async function getOptions(ids: number[]): Promise<Option[]> {
  if (ids.length === 0) return [];
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
      openTime: +call.returnValues[1],
      expiry: +call.returnValues[2],
      isCall: call.returnValues[3],
      openPrice: BigNumber.from(call.returnValues[4]),
      closePrice: BigNumber.from(call.returnValues[5]),
      deposit: BigNumber.from(call.returnValues[6]),
      payout: BigNumber.from(call.returnValues[7]),
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

export async function getLpTokenApr(
  period: number,
  currentTotalSupply: BigNumber,
  currentTotalAssets: BigNumber,
  precision = 10_000
) {
  // TODO enable this since its not available on goerli
  // const unix = Math.floor(Date.now() / 1000);
  // const { data } = await axios.get(
  //   `${DEFI_LLAMA_CHAIN_TIMESTAMP_URL}/${unix - period}`
  // );
  // const block = data.height;
  // TODO replace this line with the logic above
  const block = (await provider.getBlock('latest')).number - 1_000;

  const [oldTotalSupply, oldTotalAssets] = await Promise.all([
    LiquidityPool.totalSupply({ blockTag: block }),
    LiquidityPool.totalAssets({ blockTag: block }),
  ]);
  const oldPrice = +oldTotalAssets.mul(precision).div(oldTotalSupply);
  const newPrice = +currentTotalAssets.mul(precision).div(currentTotalSupply);

  const periodApr = (newPrice - oldPrice) / oldPrice;
  const unixYear = 365 * 24 * 60 * 60;
  return (100 * periodApr * unixYear) / period;
}
