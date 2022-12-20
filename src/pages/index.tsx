import { ethers } from 'ethers';
import * as React from 'react';
import { SSRProvider } from 'react-bootstrap';
import { createClient, WagmiConfig } from 'wagmi';

import TradePanel from '../components/TradePanel';
import WalletConnect from '../components/WalletConnect';
import { ServerContextType, ServerProvider } from '../context/ServerContext';
import { alchemy } from '../logic/alchemy';
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

const client = createClient({
  autoConnect: true,
  provider: new ethers.providers.JsonRpcProvider(alchemy.config.url),
});

export default function HomePage(props: Props) {
  const [aggregator, setAggregator] = React.useState(
    Object.keys(props.aggregators)[0]
  );
  const [duration, setDuration] = React.useState(5 * 60);
  const [isCall, setIsCall] = React.useState(true);

  return (
    <WagmiConfig client={client}>
      <SSRProvider>
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
      </SSRProvider>
    </WagmiConfig>
  );
}
