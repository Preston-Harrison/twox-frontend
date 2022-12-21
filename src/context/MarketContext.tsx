import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAccount } from 'wagmi';

import { alchemy, provider } from '../logic/alchemy';
import { Market } from '../logic/contracts';

export type Option = {
  id: number;
  aggregator: string;
  expiry: number;
  isCall: boolean;
  openPrice: BigNumber;
  closePrice: BigNumber;
  deposit: BigNumber;
  payout: BigNumber;
};

type MarketContextType = {
  options: Option[] | undefined;
};

const MarketContext = React.createContext<MarketContextType | undefined>(
  undefined
);

export function MarketProvider(props: { children: React.ReactNode }) {
  const [options, setOptions] = React.useState<Option[]>();
  const { address } = useAccount();

  const fetchOptions = React.useCallback(async (account?: string) => {
    if (!account) return setOptions(undefined);
    const { ownedNfts } = await alchemy.nft.getNftsForOwner(account, {
      contractAddresses: [Market.address],
    });
    const options: Option[] = await Promise.all(
      ownedNfts.map(async (nft) => {
        const id = +nft.tokenId;
        // TODO optimize to multicall
        const option = await Market.options(id);
        return {
          ...option,
          id,
          aggregator: option.aggregator.toLowerCase(),
          expiry: +option.expiry,
        };
      })
    );
    setOptions(options);
  }, []);

  React.useEffect(() => {
    fetchOptions(address);
    if (address) {
      const transferFrom = Market.filters.Transfer(address);
      const transferTo = Market.filters.Transfer(null, address);

      provider.on(transferFrom, () => {
        fetchOptions(address);
      });

      provider.on(transferTo, () => {
        fetchOptions(address);
      });

      return () => {
        provider.off(transferFrom);
        provider.off(transferTo);
      };
    }
  }, [fetchOptions, address]);

  return (
    <MarketContext.Provider
      value={{
        options,
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
