import { ConnectKitButton } from 'connectkit';
import dynamic from 'next/dynamic';
import Image from 'next/image';

function WalletConnect() {
  return (
    <div className='my-2'>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          const text = isConnected
            ? ensName || `${address?.slice(0, 6)}••••${address?.slice(-4)}`
            : isConnecting
            ? 'Connecting...'
            : 'Connect Wallet';
          return (
            <button
              onClick={show}
              className='flex items-center rounded-md bg-coral-dark-grey px-4 py-1 hover:brightness-110'
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
