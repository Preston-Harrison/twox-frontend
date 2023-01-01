import * as React from 'react';

import { useServer } from './ServerContext';
import { SELECTED_AGGREGATOR_KEY } from '../config';
import useLocalStorage from '../hooks/useLocalStorage';

type AggregatorContext = {
  aggregator: string;
  setAggregator: (s: string) => void;
};

const AggregatorContext = React.createContext<AggregatorContext | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export default function AggregatorProvider(props: Props) {
  const { aggregators } = useServer();
  const [aggregator, setAggregator] = useLocalStorage(
    SELECTED_AGGREGATOR_KEY,
    aggregators[0]
  );

  return (
    <AggregatorContext.Provider
      value={{
        aggregator: aggregators.includes(aggregator)
          ? aggregator
          : aggregators[0],
        setAggregator,
      }}
    >
      {props.children}
    </AggregatorContext.Provider>
  );
}

export function useAggregator(): AggregatorContext {
  const context = React.useContext(AggregatorContext);
  if (!context) {
    throw new Error('Historic price not found');
  }
  return context;
}
