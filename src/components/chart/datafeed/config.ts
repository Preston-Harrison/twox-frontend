export const exchange = 'Coral';

const config = {
  supported_resolutions: ['1D', '1W', '1M'],
  exchanges: [
    {
      value: exchange,
      name: exchange,
      desc: `${exchange} Exchange`,
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

export const BINANCE_API = 'https://api.binance.us/api/v3';

export default config;
