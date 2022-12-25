import { BigNumber } from 'ethers';
import * as React from 'react';
import { useAccount } from 'wagmi';

import usePromise from '../hooks/usePromise';
import { provider } from '../logic/alchemy';
import { UsdToken } from '../logic/contracts';

type BalanceContextType = {
  usdTokenBalance: BigNumber | undefined;
};

const BalanceContext = React.createContext<BalanceContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const BalanceProvider: React.FC<Props> = (props) => {
  const { address } = useAccount();

  const fetchBalance = React.useCallback(async () => {
    if (!address) return undefined;
    return UsdToken.balanceOf(address);
  }, [address]);

  const { data: usdTokenBalance, refresh } = usePromise(fetchBalance, 500);

  React.useEffect(() => {
    if (!address) return;
    const transferFromFilter = UsdToken.filters.Transfer(address);
    const transferToFilter = UsdToken.filters.Transfer(null, address);
    provider.on(transferFromFilter, refresh);
    provider.on(transferToFilter, refresh);

    return () => {
      provider.off(transferFromFilter, refresh);
      provider.off(transferToFilter, refresh);
    };
  }, [address, refresh]);

  return (
    <BalanceContext.Provider
      value={{
        usdTokenBalance,
      }}
    >
      {props.children}
    </BalanceContext.Provider>
  );
};

export const useBalance = (): BalanceContextType => {
  const context = React.useContext(BalanceContext);
  if (!context) {
    throw new Error('No server context found');
  }
  return context;
};
