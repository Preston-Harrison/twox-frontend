import { BigNumberish, utils } from 'ethers';

import { LP_TOKEN_SYMBOL, USD_TOKEN_SYMBOL } from './contracts';

const { format: compactNum } = Intl.NumberFormat('en', { notation: 'compact' });

export const formatOraclePrice = (n: BigNumberish, pair: string) => {
  const num = Number(n) / 1e8;
  const decimals = num >= 10 ? 2 : 4;
  const stringified = num.toLocaleString('en', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
  return `${stringified} ${pair.split('/')[1] || ''}`;
};

export const formatTokenAmount = (n: BigNumberish, compact = false) => {
  const num = utils.formatUnits(n, 18);
  if (compact && +num >= 100_000) {
    return `${compactNum(+num)} ${USD_TOKEN_SYMBOL}`;
  }

  const stringified = (+num).toLocaleString('en', {
    maximumFractionDigits: 2,
  });
  return `${stringified} ${USD_TOKEN_SYMBOL}`;
};

export const formatLpTokenAmount = (n: BigNumberish, compact = false) => {
  const num = utils.formatUnits(n, 18);
  if (compact && +num >= 100_000) {
    return `${compactNum(+num)} ${LP_TOKEN_SYMBOL}`;
  }

  const stringified = (+num).toLocaleString('en', {
    maximumFractionDigits: 2,
  });
  return `${stringified} ${LP_TOKEN_SYMBOL}`;
};

export const numToToken = (n: number) => {
  if (isNaN(n)) return '-';
  const stringified = (+n).toLocaleString('en', {
    maximumFractionDigits: 2,
  });
  return `${stringified} ${USD_TOKEN_SYMBOL}`;
};
