import React from 'react';

import datafeed from './datafeed';
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
} from './datafeed/charting_library';
import { pushPrice } from './datafeed/streaming';
import { DEFAULT_RESOLUTION, EXCHANGE_NAME } from '../../config';
import { useAggregator } from '../../context/AggregatorContext';
import { useServer } from '../../context/ServerContext';

const Chart = () => {
  const { aggregators, prices, aggregatorData } = useServer();
  const { aggregator, setAggregator } = useAggregator();
  const [tvWidget, setTvWidget] = React.useState<IChartingLibraryWidget>();

  React.useEffect(() => {
    aggregators.map((a) => {
      pushPrice(aggregatorData[a].pair, +prices[a] / 1e8);
    });
  }, [aggregators, prices, aggregatorData]);

  React.useEffect(() => {
    const config: ChartingLibraryWidgetOptions = {
      symbol: `${EXCHANGE_NAME}:${aggregatorData[aggregator].pair}`,
      interval: DEFAULT_RESOLUTION, // default interval
      fullscreen: false, // displays the chart in the fullscreen mode
      container: 'tv_chart_container',
      datafeed,
      library_path: '/charting_library/',
      autosize: true,
      locale: 'en',
      theme: 'Dark',
      custom_css_url: '/charting_library/styles.css',
    };
    const widget = new (window as any).TradingView.widget(config);

    widget.onChartReady(() => {
      setTvWidget(widget);
      widget
        .activeChart()
        .onSymbolChanged()
        .subscribe(null, ({ ticker }: { ticker: string }) => {
          const pair = ticker.split(':')[1];
          if (!pair) return console.error(`Could not find pair from ${ticker}`);
          const aggregator = Object.keys(aggregatorData).find(
            (a) => aggregatorData[a].pair === pair
          );
          if (!aggregator)
            return console.error(`Could not find aggregator for pair ${pair}`);
          setAggregator(aggregator);
        });
    });

    return () => {
      widget.remove();
      setTvWidget(undefined);
    };
    // ignoring deps cuz aggregator is only needed on first construction
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [aggregatorData, aggregators]);

  React.useEffect(() => {
    if (!tvWidget) return;
    const { interval } = tvWidget.symbolInterval();
    tvWidget.setSymbol(
      `${EXCHANGE_NAME}:${aggregatorData[aggregator].pair}`,
      interval,
      () => void 0
    );
  }, [aggregator, tvWidget, aggregatorData]);

  return <div id='tv_chart_container' className='h-full' />;
};

export default Chart;
