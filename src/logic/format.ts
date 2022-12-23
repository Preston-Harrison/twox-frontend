import { BigNumberish, utils } from 'ethers';

import { USD_TOKEN_SYMBOL } from './contracts';

export const oracleToUsd = (n: BigNumberish) => {
  const num = Number(n) / 1e8;
  const stringified = num.toLocaleString('en', {
    maximumFractionDigits: 2,
  });
  return `$${stringified} USD`;
};

export const tokenToUsd = (n: BigNumberish) => {
  const num = utils.formatUnits(n, 18);
  const stringified = (+num).toLocaleString('en', {
    maximumFractionDigits: 2,
  });
  return `$${stringified} ${USD_TOKEN_SYMBOL}`;
};
