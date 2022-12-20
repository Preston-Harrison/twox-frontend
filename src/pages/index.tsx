import * as React from 'react';

import TradePanel from '../components/TradePanel';
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

export default function HomePage(props: Props) {
  const [aggregator, setAggregator] = React.useState(
    Object.keys(props.aggregators)[0]
  );
  const [duration, setDuration] = React.useState(5 * 60);
  const [isCall, setIsCall] = React.useState(true);
  return (
    <ServerProvider initialValues={props}>
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
  );
}
