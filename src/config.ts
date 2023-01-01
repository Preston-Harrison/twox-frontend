export const DURATIONS = [
  {
    units: 'mins',
    display: '15',
    duration: 60 * 15,
  },
  {
    units: 'mins',
    display: '30',
    duration: 60 * 30,
  },
  {
    units: 'hour',
    display: '1',
    duration: 60 * 60,
  },
  {
    units: 'hours',
    display: '4',
    duration: 60 * 60 * 4,
  },
  {
    units: 'day',
    display: '1',
    duration: 60 * 60 * 24,
  },
  // {
  //   units: 'days',
  //   display: '3',
  //   duration: 60 * 60 * 24 * 3,
  // },
];

export const EXCHANGE_NAME = 'Coral';

export const CHART_CONFIG = {
  supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W', '1M'],
  exchanges: [
    {
      value: EXCHANGE_NAME,
      name: EXCHANGE_NAME,
      desc: `${EXCHANGE_NAME} Exchange`,
    },
  ],
  symbols_types: [
    {
      name: 'crypto',
      value: 'crypto',
    },
  ],
};
export const DEFAULT_RESOLUTION = '15';

export const RESOLUTION_TO_MILLIS: Record<string, number> = {
  '1': 60 * 1000,
  '5': 5 * 60 * 1000,
  '15': 15 * 60 * 1000,
  '30': 30 * 60 * 1000,
  '60': 60 * 60 * 1000,
  '240': 240 * 60 * 1000,
  '1D': 24 * 60 * 60 * 1000,
  '1W': 7 * 24 * 60 * 60 * 1000,
  '1M': 30 * 24 * 60 * 60 * 1000,
};

export const BINANCE_RESOLUTION_MAP: Record<string, string> = {
  '1': '1m',
  '5': '5m',
  '15': '15m',
  '30': '30m',
  '60': '1h',
  '240': '4h',
  '1D': '1d',
  '1W': '1w',
  '1M': '1M',
};

export const PAIR_TO_BINANCE_CHART_TICKER: Record<string, string> = {
  'ETH/USD': 'ETHUSD',
  'BTC/USD': 'BTCUSD',
  'SOL/USD': 'SOLUSD',
  'MATIC/USD': 'MATICUSD',
  'BNB/USD': 'BNBUSD',
  'AVAX/USD': 'AVAXUSD',
  'LINK/USD': 'LINKUSD',
  'UNI/USD': 'UNIUSD',
};

export const BINANCE_API = 'https://api.binance.us/api/v3';

export const MARKET_PRECISION = 10_000;
export const OPTION_DIFF_SHOW_THRESHOLD = 1 / 10_000; // 0.01%
export const DAILY_REFRESH_DURATION = 60 * 1000;
export const PRICE_REFRESH_DURATION = 1_000;
export const DEFI_LLAMA_CHAIN_TIMESTAMP_URL =
  'https://coins.llama.fi/block/ethereum';
export const SELECTED_AGGREGATOR_KEY = 'selected_aggregator';
export const FAVORITE_PAIR_KEY = 'favorite_pair';
