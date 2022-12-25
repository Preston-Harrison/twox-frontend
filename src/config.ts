export const DURATIONS = [
  {
    units: 'mins',
    display: '5',
    duration: 60 * 5,
  },
  {
    units: 'mins',
    display: '15',
    duration: 60 * 15,
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
];

export const EXCHANGE_NAME = 'Coral';

export const CHART_CONFIG = {
  supported_resolutions: ['5', '15', '30', '60', '240', '1D', '1W', '1M'],
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

export const RESOLUTION_TO_MILLIS: Record<string, number> = {
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
  'ETH/USD': 'ETHUSDT',
  'BTC/USD': 'BTCUSDT',
};

export const BINANCE_API = 'https://api.binance.us/api/v3';

export const MARKET_PRECISION = 10_000;
export const OPTION_DIFF_SHOW_THRESHOLD = 1 / 10_000; // 0.01%
export const DAILY_REFRESH_DURATION = 60 * 1000;
