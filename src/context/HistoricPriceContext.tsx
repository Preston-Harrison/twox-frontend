import * as React from 'react';

import { useServer } from './ServerContext';
import { DAILY_REFRESH_DURATION } from '../config';
import { fetchDailyStats } from '../logic/binance';

type HistoricPrice = {
  high: number;
  low: number;
  open: number;
};

type HistoricPriceContextType = {
  data: Record<string, HistoricPrice | undefined>;
};

const HistoricPriceContext = React.createContext<
  HistoricPriceContextType | undefined
>(undefined);

type Props = {
  children: React.ReactNode;
};

export default function HistoricPriceProvider(props: Props) {
  const { aggregatorData } = useServer();
  const [historicPrices, setHistoricPrices] = React.useState<
    Record<string, HistoricPrice | undefined>
  >({});

  const refresh = React.useCallback(async () => {
    const data = await fetchDailyStats(
      Object.values(aggregatorData).map((d) => d.pair)
    );
    const aggregatorToPrice = data.reduce((acc, curr) => {
      const aggregator = Object.keys(aggregatorData).find((d) => {
        return aggregatorData[d].pair === curr.pair;
      });
      if (!aggregator) return acc;
      return {
        ...acc,
        [aggregator]: {
          ...curr,
        },
      };
    }, {} as Record<string, HistoricPrice>);
    setHistoricPrices(aggregatorToPrice);
  }, [aggregatorData]);

  React.useEffect(() => {
    refresh();
    const id = setInterval(refresh, DAILY_REFRESH_DURATION);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <HistoricPriceContext.Provider
      value={{
        data: historicPrices,
      }}
    >
      {props.children}
    </HistoricPriceContext.Provider>
  );
}

export function useHistoricPrice(): HistoricPriceContextType {
  const context = React.useContext(HistoricPriceContext);
  if (!context) {
    throw new Error('Historic price not found');
  }
  return context;
}
