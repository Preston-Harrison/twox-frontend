import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <button
        onClick={() => disconnect()}
        className='border border-sky-500 p-2'
      >
        Connected ({address?.slice(0, 6)}...{address?.slice(-4)})
      </button>
    );
  return (
    <button onClick={() => connect()} className='border border-sky-500 p-2'>
      Connect Wallet
    </button>
  );
}
