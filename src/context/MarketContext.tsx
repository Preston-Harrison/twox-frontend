import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAccount } from 'wagmi';

import { useServer } from './ServerContext';
import usePromise from '../hooks/usePromise';
import { alchemy, provider } from '../logic/alchemy';
import {
  AggregatorConfig,
  getAggregatorConfigs,
  getOptions,
} from '../logic/complexCalls';
import { Market } from '../logic/contracts';

export type Option = {
  id: number;
  aggregator: string;
  openTime: number;
  expiry: number;
  isCall: boolean;
  openPrice: BigNumber;
  closePrice: BigNumber;
  deposit: BigNumber;
  payout: BigNumber;
};

type MarketContextType = {
  options: Option[] | undefined;
  aggregatorConfig: Record<string, AggregatorConfig> | undefined;
};

const MarketContext = React.createContext<MarketContextType | undefined>(
  undefined
);

export function MarketProvider(props: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { aggregators } = useServer();

  const fetchOptions = React.useCallback(async () => {
    if (!address) return;
    const { ownedNfts } = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [Market.address],
    });
    const ids = ownedNfts.map((nft) => +nft.tokenId);
    return getOptions(ids);
  }, [address]);

  const fetchConfig = React.useCallback(async () => {
    const c = await getAggregatorConfigs(aggregators);
    return c.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.aggregator]: curr,
      };
    }, {} as Record<string, AggregatorConfig>);
  }, [aggregators]);

  const { data: options, refresh: refreshOptions } = usePromise(
    fetchOptions,
    500
  );
  const { data: aggregatorConfig, refresh: refreshConfig } = usePromise(
    fetchConfig,
    500
  );

  React.useEffect(() => {
    refreshOptions();
    if (address) {
      const transferFrom = Market.filters.Transfer(address);
      const transferTo = Market.filters.Transfer(null, address);

      provider.on(transferFrom, () => {
        refreshOptions();
      });

      provider.on(transferTo, () => {
        refreshOptions();
      });

      return () => {
        provider.off(transferFrom);
        provider.off(transferTo);
      };
    }
  }, [refreshOptions, address]);

  React.useEffect(() => {
    refreshConfig();
    if (address) {
      const filter = Market.filters.SetAggregatorConfig();

      provider.on(filter, refreshConfig);

      return () => {
        provider.off(filter);
      };
    }
  }, [refreshConfig, address]);

  return (
    <MarketContext.Provider
      value={{
        options,
        aggregatorConfig,
      }}
    >
      {props.children}
    </MarketContext.Provider>
  );
}

export function useMarket(): MarketContextType {
  const context = React.useContext(MarketContext);
  if (!context) {
    throw new Error('Market context not found');
  }
  return context;
}
