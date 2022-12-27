import classNames from 'classnames';
import { ConnectKitButton } from 'connectkit';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { truncateAddress } from '../logic/utils';

type Props = {
  className?: string;
};

function WalletConnect(props: Props) {
  return (
    <div className={classNames('my-2', props.className)}>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          const text = isConnected
            ? ensName || truncateAddress(address!)
            : isConnecting
            ? 'Connecting...'
            : 'Connect Wallet';
          return (
            <button
              onClick={show}
              className={classNames(
                'flex items-center rounded-md px-4 py-1 hover:brightness-110',
                {
                  'bg-coral-light-blue': !isConnected,
                  'bg-coral-dark-grey': isConnected,
                }
              )}
            >
              <div className='mr-2 brightness-75'>
                <Image
                  src='/images/wallet.png'
                  alt='Wallet'
                  className='max-h-full max-w-full rounded-full object-contain invert'
                  width={28}
                  height={28}
                />
              </div>
              {text}
            </button>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}

// make it not SSR
export default dynamic(() => Promise.resolve(WalletConnect), { ssr: false });
