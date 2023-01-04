import * as React from 'react';

import Chart from '../components/chart/Chart';
import Layout from '../components/Layout';
import Options from '../components/options/Options';
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
      <ServerProvider initialValues={props}>
        <MarketProvider>
          <HistoricPriceProvider>
            <BalanceProvider>
              <AggregatorProvider>
                <Layout>
                  <div
                    className='relative w-full flex-1 max-laptop:flex 
                  max-laptop:flex-col laptop:grid laptop:grid-cols-[1fr_4fr]
                  laptop:grid-rows-[65px_1fr]'
                  >
                    <TradePanel />
                    <div className='overflow-auto'>
                      <div className='max-laptop:h-[65vh] laptop:h-3/4'>
                        <Chart />
                      </div>
                      <Options />
                    </div>
                  </div>
                </Layout>
              </AggregatorProvider>
            </BalanceProvider>
          </HistoricPriceProvider>
        </MarketProvider>
      </ServerProvider>
    </WalletProvider>
  );
}
