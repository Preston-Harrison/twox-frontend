import axios from 'axios';

import { Bar } from '../components/chart/datafeed/datafeed-api';
import {
  BINANCE_API,
  BINANCE_RESOLUTION_MAP,
  PAIR_TO_BINANCE_CHART_TICKER as PAIR_TO_BINANCE_TICKER,
} from '../config';

export async function fetchBinanceBars(
  pair: string,
  from: number,
  to: number,
  interval: string
) {
  const { data } = await axios.get(`${BINANCE_API}/uiKlines`, {
    params: {
      symbol: PAIR_TO_BINANCE_TICKER[pair],
      interval: BINANCE_RESOLUTION_MAP[interval],
      startTime: from * 1000,
      endTime: to * 1000,
    },
  });

  const bars: Bar[] = data.map((d: any[]) => {
    return {
      time: +d[0],
      high: +d[2],
      low: +d[3],
      open: +d[1],
      close: +d[4],
      volume: +d[5],
    };
  });
  return bars;
}

export async function fetchDailyStats(pairs: string[]) {
  const { data } = await axios.get(`${BINANCE_API}/ticker/24hr`, {
    params: {
      symbols:
        '["' + pairs.map((p) => PAIR_TO_BINANCE_TICKER[p]).join('","') + '"]',
    },
  });

  const findPairForTicker = (ticker: string) => {
    return Object.keys(PAIR_TO_BINANCE_TICKER).find((pair) => {
      return PAIR_TO_BINANCE_TICKER[pair] === ticker;
    });
  };

  const tickers = data.map((d: any) => ({
    pair: findPairForTicker(d.symbol),
    open: +d.openPrice,
    high: +d.highPrice,
    low: +d.lowPrice,
  }));

  return tickers as {
    pair: string;
    open: number;
    high: number;
    low: number;
  }[];
}
