import { utils } from 'ethers';

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
