import * as React from 'react';

import { fetchPrices } from '../logic/api';
import { HomePageProps } from '../pages';

export type ServerContextType = {
  aggregators: string[];
  aggregatorToPair: Record<string, string>;
  prices: Record<string, string>;
};

const ServerContext = React.createContext<ServerContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
  initialValues: HomePageProps;
  priceRefreshDuration: number;
};

export const ServerProvider: React.FC<Props> = (props) => {
  const [aggregatorToPair, _setAggregators] = React.useState<
    Record<string, string>
  >(props.initialValues.aggregatorToPair);
  const [prices, setPrices] = React.useState<Record<string, string>>(
    props.initialValues.prices
  );

  const refreshPrices = React.useCallback(async () => {
    const prices = await fetchPrices();
    setPrices((curr) => ({
      ...curr,
      ...prices,
    }));
  }, []);

  React.useEffect(() => {
    refreshPrices();
    const id = setInterval(refreshPrices, props.priceRefreshDuration);
    return () => clearInterval(id);
  }, [refreshPrices, props.priceRefreshDuration]);

  const aggregators = React.useMemo(
    () => Object.keys(aggregatorToPair),
    [aggregatorToPair]
  );

  return (
    <ServerContext.Provider
      value={{
        prices,
        aggregators,
        aggregatorToPair,
      }}
    >
      {props.children}
    </ServerContext.Provider>
  );
};

export const useServer = (): ServerContextType => {
  const context = React.useContext(ServerContext);
  if (!context) {
    throw new Error('No server context found');
  }
  return context;
};
