import { utils } from 'ethers';

export const canParse = (n: string, decimals: number) => {
  try {
    utils.parseUnits(n, decimals);
    return true;
  } catch (e) {
    return false;
  }
};
