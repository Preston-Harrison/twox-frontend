import { ContractTransaction } from 'ethers';
import * as React from 'react';
import { toast } from 'react-toastify';

type Notification = {
  mined: string;
  mining: string;
  submitting: string;
  failed?: string;
};

const DEFAULT_NOTIFICATION: Notification = {
  mined: 'Transaction successful',
  mining: 'Awaiting transaction confirmation',
  submitting: 'Awaiting transaction approval',
  failed: undefined,
};

const TRANSACTION_CANCELLED = 'Transaction cancelled';
const DEFAULT_FAILED_MESSAGE = 'Transaction failed';
const options = {
  closeOnClick: true,
};

export default function useTransactionSender() {
  const [sending, setSending] = React.useState(false);

  const send = React.useCallback(
    async (
      tx: Promise<ContractTransaction>,
      notification: Partial<Notification> = {}
    ) => {
      if (sending) throw new Error('Already sending transaction');
      setSending(true);
      notification = { ...DEFAULT_NOTIFICATION, ...notification };

      let toastId = toast.loading(notification.submitting, options);
      try {
        const submittedTx = await tx;
        toast.dismiss(toastId);

        toastId = toast.loading(notification.mining, options);
        const minedTx = await submittedTx.wait();
        toast.dismiss(toastId);

        toastId = toast.success(notification.mined, options);
        return minedTx;
      } catch (e: any) {
        toast.dismiss(toastId);
        if (e.code === 'ACTION_REJECTED') {
          toast.info(TRANSACTION_CANCELLED, options);
        } else if (typeof e.reason === 'string' && !notification.failed) {
          const error = e.reason as string;
          toast.error(
            'Transaction failed: ' + error.replace('execution reverted: ', ''),
            options
          );
        } else {
          toast.error(notification.failed || DEFAULT_FAILED_MESSAGE, options);
          console.error(e);
        }
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  return {
    send,
    sending,
  };
}
