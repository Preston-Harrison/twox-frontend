import React from 'react';

import datafeed from './datafeed';
import { exchange } from './datafeed/config';
import { pushPrice } from './datafeed/streaming';
import { useServer } from '../../context/ServerContext';

const Chart = () => {
  const { aggregators, prices } = useServer();

  React.useEffect(() => {
    Object.keys(aggregators).map((a) => {
      pushPrice(aggregators[a], +prices[a] / 1e8);
    });
  }, [aggregators, prices]);

  React.useEffect(() => {
    new (window as any).TradingView.widget({
      symbol: `${exchange}:${Object.values(aggregators)[0]}`, // default symbol
      interval: '1D', // default interval
      fullscreen: false, // displays the chart in the fullscreen mode
      container: 'tv_chart_container',
      datafeed,
      library_path: 'charting_library/',
      autosize: true,
    });
    // aggregator is not needed here
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return <div id='tv_chart_container' className='flex-1' />;
};

export default Chart;
