export const DURATIONS = [5 * 60, 10 * 60, 30 * 60];

export const EXCHANGE_NAME = 'Coral';

export const CHART_CONFIG = {
  supported_resolutions: ['1D', '1W', '1M'],
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

export const BINANCE_RESOLUTION_MAP: Record<string, string> = {
  '1D': '1d',
  '1W': '1w',
  '1M': '1M',
};

export const PAIR_TO_BINANCE_CHART_TICKER: Record<string, string> = {
  'ETH/USD': 'ETHUSDT',
  'BTC/USD': 'BTCUSDT',
};

export const BINANCE_API = 'https://api.binance.us/api/v3';
