import { BigNumberish, utils } from 'ethers';

import { USD_TOKEN_SYMBOL } from './contracts';

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

export const formatTokenAmount = (n: BigNumberish) => {
  const num = utils.formatUnits(n, 18);
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
