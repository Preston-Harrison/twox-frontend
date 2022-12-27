import { BigNumberish, utils } from 'ethers';

import { USD_TOKEN_SYMBOL } from './contracts';

const { format: compactNum } = Intl.NumberFormat('en', { notation: 'compact' });

export const formatOraclePrice = (
  n: BigNumberish,
  pair: string,
  decimals = 2
) => {
  const num = Number(n) / 1e8;
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

export const numToToken = (n: number) => {
  if (isNaN(n)) return '-';
  const stringified = (+n).toLocaleString('en', {
    maximumFractionDigits: 2,
  });
  return `${stringified} ${USD_TOKEN_SYMBOL}`;
};
