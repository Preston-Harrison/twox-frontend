import * as React from 'react';

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
};

export const ServerProvider: React.FC<Props> = (props) => {
  const [aggregators, _setAggregators] = React.useState<
    Props['initialValues']['aggregators']
  >(props.initialValues.aggregators);
  const [prices, _setPrices] = React.useState<Props['initialValues']['prices']>(
    props.initialValues.prices
  );
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
