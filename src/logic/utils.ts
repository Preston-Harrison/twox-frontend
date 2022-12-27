import { utils } from 'ethers';

import { Bar } from '../components/chart/datafeed/datafeed-api';
import { Option } from '../context/MarketContext';

export const canParse = (n: string, decimals: number) => {
  try {
    utils.parseUnits(n, decimals);
    return true;
  } catch (e) {
    return false;
  }
};

export const calculateDelta = (base: number, current: number) => {
  return (current - base) / base;
};

export const truncateAddress = (address: string) => {
  return `${address?.slice(0, 6)}••••${address?.slice(-4)}`;
};

export const isInTheMoney = (option: Option, currentPrice: number) => {
  return option.isCall
    ? currentPrice > +option.openPrice
    : currentPrice < +option.openPrice;
};

export const fillBarGaps = (bars: Bar[]) => {
  bars.forEach((bar, i) => {
    if (bars[i + 1]) {
      bar.close = bars[i + 1].open;
    }
  });
};
