import classNames from 'classnames';
import Image from 'next/image';
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
import useWindowSize from '../hooks/useWindowSize';
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

type Tab = 'trade' | 'chart' | 'options';

export default function HomePage(props: HomePageProps) {
  const [mobileTab, setMobileTab] = React.useState<Tab>('trade');
  const { width } = useWindowSize();
  const isMobile = width && width < 640;

  const mobileFooterRef = React.useRef<HTMLDivElement>(null);
  const mobileFooterHeight = mobileFooterRef.current?.clientHeight;

  return (
    <WalletProvider>
      <ServerProvider initialValues={props}>
        <MarketProvider>
          <HistoricPriceProvider>
            <BalanceProvider>
              <AggregatorProvider>
                <Layout>
                  {/* Desktop layout */}
                  {!isMobile && (
                    <div
                      className='relative grid w-full flex-1 grid-cols-[1fr_4fr]
                  grid-rows-[65px_1fr]'
                    >
                      <TradePanel />
                      <div className='overflow-auto'>
                        <div className='h-3/4'>
                          <Chart className='h-full' />
                        </div>
                        <Options />
                      </div>
                    </div>
                  )}
                  {/* Mobile layout */}
                  {isMobile && (
                    <>
                      <div
                        className={classNames('flex-1', {
                          hidden: mobileTab !== 'trade',
                        })}
                      >
                        <TradePanel />
                      </div>
                      <div
                        className={classNames('flex flex-1', {
                          hidden: mobileTab !== 'chart',
                        })}
                      >
                        <Chart className='flex-1' />
                      </div>
                      <div
                        className={classNames('flex-1', {
                          hidden: mobileTab !== 'options',
                        })}
                      >
                        <Options />
                      </div>
                      {/* dummy div to stop content from floating behind fixed footer at bottom of scroll */}
                      <div style={{ height: mobileFooterHeight }} />
                      <footer
                        ref={mobileFooterRef}
                        className={`fixed bottom-0 left-0 z-[100] flex w-screen items-center justify-center gap-8
                    border-t border-coral-dark-grey bg-coral-blue py-2 text-sm text-white laptop:hidden`}
                      >
                        <div
                          onClick={() => setMobileTab('chart')}
                          className={classNames(
                            'flex flex-col items-center gap-1',
                            {
                              'brightness-[0.6]': mobileTab !== 'chart',
                            }
                          )}
                        >
                          <Image
                            src='/images/chart_icon.png'
                            width={16}
                            height={16}
                            alt='chart icon'
                            className='invert'
                          />
                          <div>Chart</div>
                        </div>
                        <div
                          onClick={() => setMobileTab('trade')}
                          className={classNames(
                            'flex flex-col items-center gap-1',
                            {
                              'brightness-[0.6]': mobileTab !== 'trade',
                            }
                          )}
                        >
                          <Image
                            src='/images/order_icon.png'
                            width={16}
                            height={16}
                            alt='trade icon'
                            className='invert'
                          />
                          <div>Trade</div>
                        </div>
                        <div
                          onClick={() => setMobileTab('options')}
                          className={classNames(
                            'flex flex-col items-center gap-1',
                            {
                              'brightness-[0.6]': mobileTab !== 'options',
                            }
                          )}
                        >
                          <Image
                            src='/images/list_icon.png'
                            width={16}
                            height={16}
                            alt='options icon'
                            className='invert'
                          />
                          <div>Options</div>
                        </div>
                      </footer>
                    </>
                  )}
                </Layout>
              </AggregatorProvider>
            </BalanceProvider>
          </HistoricPriceProvider>
        </MarketProvider>
      </ServerProvider>
    </WalletProvider>
  );
}
