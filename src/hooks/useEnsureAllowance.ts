import { BigNumberish, constants, Signer } from 'ethers';

import useTransactionSender from './useTransactionSender';
import { UsdToken } from '../logic/contracts';

export default function useEnsureUsdAllowance() {
  const { send, sending } = useTransactionSender();

  const ensureAllowance = async (
    owner: Signer,
    spender: string,
    allowance: BigNumberish
  ) => {
    const currentAllowance = await UsdToken.allowance(
      owner.getAddress(),
      spender
    );
    if (currentAllowance.lt(allowance)) {
      const tx = UsdToken.connect(owner).approve(spender, constants.MaxUint256);
      await send(tx);
    }
  };

  return { ensureAllowance, sending };
}
