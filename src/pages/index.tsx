import * as React from 'react';

import Chart from '../components/chart/Chart';
import Layout from '../components/Layout';
import Options from '../components/Options';
import TradePanel from '../components/trade_panel/TradePanel';
import AggregatorProvider from '../context/AggregatorContext';
import { BalanceProvider } from '../context/BalanceContext';
import HistoricPriceProvider from '../context/HistoricPriceContext';
import { MarketProvider } from '../context/MarketContext';
import { ServerProvider } from '../context/ServerContext';
import WalletProvider from '../context/WalletContext';
import { AggregatorData, fetchAggregatorData, fetchPrices } from '../logic/api';

export type HomePageProps = {
  prices: Record<string, string>;
  aggregatorData: Record<string, AggregatorData>;
};

export async function getServerSideProps(): Promise<{ props: HomePageProps }> {
  return {
    props: {
      aggregatorData: await fetchAggregatorData(),
      prices: await fetchPrices(),
    },
  };
}

export default function HomePage(props: HomePageProps) {
  return (
    <WalletProvider>
      <MarketProvider>
        <ServerProvider initialValues={props}>
          <HistoricPriceProvider>
            <BalanceProvider>
              <AggregatorProvider>
                <Layout>
                  <div
                    className={`relative grid h-full w-full 
                  grid-cols-[1fr_4fr] grid-rows-[65px_1fr] bg-coral-dark-grey`}
                  >
                    <TradePanel />
                    <div className='row-span-2 h-full overflow-auto'>
                      <div className='h-3/4'>
                        <Chart />
                      </div>
                      <Options />
                    </div>
                  </div>
                </Layout>
              </AggregatorProvider>
            </BalanceProvider>
          </HistoricPriceProvider>
        </ServerProvider>
      </MarketProvider>
    </WalletProvider>
  );
}
