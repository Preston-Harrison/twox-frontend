import * as React from 'react';

import { fetchPrices } from '../logic/api';

export type ServerContextType = {
  aggregators: Record<string, string>;
  prices: Record<string, string>;
};
const ServerContext = React.createContext<ServerContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
  initialValues: ServerContextType;
  priceRefreshDuration: number;
};

type Aggregators = Props['initialValues']['aggregators'];
type Prices = Props['initialValues']['prices'];

export const ServerProvider: React.FC<Props> = (props) => {
  const [aggregators, _setAggregators] = React.useState<Aggregators>(
    props.initialValues.aggregators
  );
  const [prices, setPrices] = React.useState<Prices>(
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

  return (
    <ServerContext.Provider
      value={{
        aggregators,
        prices,
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
