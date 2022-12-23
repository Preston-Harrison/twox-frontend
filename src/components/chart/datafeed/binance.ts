import axios from 'axios';

import { Bar } from './datafeed-api';
import {
  BINANCE_API,
  BINANCE_RESOLUTION_MAP,
  PAIR_TO_BINANCE_CHART_TICKER,
} from '../../../config';

export async function fetchBinanceBars(
  pair: string,
  from: number,
  to: number,
  interval: string
) {
  const { data } = await axios.get(`${BINANCE_API}/uiKlines`, {
    params: {
      symbol: PAIR_TO_BINANCE_CHART_TICKER[pair],
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
