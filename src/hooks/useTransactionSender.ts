import { ContractTransaction } from 'ethers';
import * as React from 'react';
import { toast } from 'react-toastify';

type Notification = {
  mined: string;
  mining: string;
  submitting: string;
  failed: string;
};

const DEFAULT_NOTIFICATION: Notification = {
  mined: 'Transaction successful!',
  mining: 'Transaction pending...',
  submitting: 'Submitting transaction...',
  failed: 'Transaction failed.',
};

const TRANSACTION_CANCELLED = 'Transaction cancelled';

export default function useTransactionSender() {
  const [sending, setSending] = React.useState(false);

  const send = async (
    tx: Promise<ContractTransaction>,
    notification: Partial<Notification> = {}
  ) => {
    if (sending) throw new Error('Already sending transaction');
    setSending(true);
    notification = { ...DEFAULT_NOTIFICATION, ...notification };

    let toastId = toast.loading(notification.submitting);
    try {
      const submittedTx = await tx;
      toast.dismiss(toastId);

      toastId = toast.loading(notification.mining);
      const minedTx = await submittedTx.wait();
      toast.dismiss(toastId);

      toastId = toast.success(notification.mined);
      return minedTx;
    } catch (e: any) {
      toast.dismiss(toastId);
      if (e.code === 'ACTION_REJECTED') {
        toast.info(TRANSACTION_CANCELLED);
      } else {
        toast.error(notification.failed);
      }
    } finally {
      setSending(false);
    }
  };

  return {
    send,
    sending,
  };
}
