import React from 'react';

import datafeed from './datafeed';
import { ChartingLibraryWidgetOptions } from './datafeed/charting_library';
import { pushPrice } from './datafeed/streaming';
import { EXCHANGE_NAME } from '../../config';
import { useServer } from '../../context/ServerContext';

const Chart = () => {
  const { aggregators, prices, aggregatorData } = useServer();

  React.useEffect(() => {
    aggregators.map((a) => {
      pushPrice(aggregatorData[a].pair, +prices[a] / 1e8);
    });
  }, [aggregators, prices, aggregatorData]);

  React.useEffect(() => {
    const config: ChartingLibraryWidgetOptions = {
      symbol: `${EXCHANGE_NAME}:${aggregatorData[aggregators[0]].pair}`, // default symbol
      interval: '1D', // default interval
      fullscreen: false, // displays the chart in the fullscreen mode
      container: 'tv_chart_container',
      datafeed,
      library_path: 'charting_library/',
      autosize: true,
      locale: 'en',
      theme: 'Dark',
    };
    new (window as any).TradingView.widget(config);
  }, [aggregatorData, aggregators]);

  return <div id='tv_chart_container' className='h-full' />;
};

export default Chart;
