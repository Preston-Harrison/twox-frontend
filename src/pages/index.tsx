import * as React from 'react';
import { SSRProvider } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import 'react-toastify/dist/ReactToastify.css';

import TradePanel from '../components/TradePanel';
import WalletConnect from '../components/WalletConnect';
import { MarketProvider } from '../context/MarketContext';
import { ServerContextType, ServerProvider } from '../context/ServerContext';
import { fetchAggregators, fetchPrices } from '../logic/api';

type Props = ServerContextType;

export async function getServerSideProps(): Promise<{ props: Props }> {
  return {
    props: {
      aggregators: await fetchAggregators(),
      prices: await fetchPrices(),
    },
  };
}

const { chains, provider } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! }),
    publicProvider(),
  ]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
});

export default function HomePage(props: Props) {
  const [aggregator, setAggregator] = React.useState(
    Object.keys(props.aggregators)[0]
  );
  const [duration, setDuration] = React.useState(5 * 60);
  const [isCall, setIsCall] = React.useState(true);

  return (
    <WagmiConfig client={wagmiClient}>
      <SSRProvider>
        <MarketProvider>
          <ServerProvider initialValues={props}>
            <div className='ml-auto w-full'>
              <WalletConnect />
            </div>
            <div className='grid h-full w-full grid-cols-4 p-4'>
              <TradePanel
                aggregator={aggregator}
                setAggregator={setAggregator}
                duration={duration}
                setDuration={setDuration}
                isCall={isCall}
                setIsCall={setIsCall}
              />
            </div>
          </ServerProvider>
        </MarketProvider>
      </SSRProvider>
      <ToastContainer />
    </WagmiConfig>
  );
}
