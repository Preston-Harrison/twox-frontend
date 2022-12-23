import * as React from 'react';
import { SSRProvider } from 'react-bootstrap';

import 'react-toastify/dist/ReactToastify.css';

import Chart from '../components/chart/Chart';
import Layout from '../components/Layout';
import Options from '../components/Options';
import TradePanel from '../components/TradePanel';
import { MarketProvider } from '../context/MarketContext';
import { ServerContextType, ServerProvider } from '../context/ServerContext';
import WalletProvider from '../context/WalletContext';
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
  return (
    <WalletProvider>
      <SSRProvider>
        <MarketProvider>
          <ServerProvider initialValues={props} priceRefreshDuration={1000}>
            <Layout>
              <div className='flex w-full flex-1 p-4'>
                <div className='w-1/5'>
                  <TradePanel />
                </div>
                <div className='flex flex-1 flex-col'>
                  <Chart />
                  <div className='h-1/4'>
                    <Options />
                  </div>
                </div>
              </div>
            </Layout>
          </ServerProvider>
        </MarketProvider>
      </SSRProvider>
    </WalletProvider>
  );
}
