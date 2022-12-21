import React from 'react';

import datafeed from './datafeed';

type ResolutionString = any;

const Chart = () => {
  React.useEffect(() => {
    new (window as any).TradingView.widget({
      symbol: 'Bitfinex:BTC/USD', // default symbol
      interval: '1D' as ResolutionString, // default interval
      fullscreen: false, // displays the chart in the fullscreen mode
      container: 'tv_chart_container',
      datafeed,
      library_path: 'charting_library/',
    });
  }, []);

  return (
    <div className='bg-background flex h-full flex-col'>
      <div id='tv_chart_container' />
    </div>
  );
};

export default Chart;
