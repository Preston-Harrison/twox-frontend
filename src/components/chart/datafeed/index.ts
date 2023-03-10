/* eslint-disable */
import { CHART_CONFIG } from '../../../config';
import { IDatafeedChartApi, IExternalDatafeed } from './datafeed-api';
import { getBars } from './getBars';
import { resolveSymbol } from './resolveSymbol';
import { searchSymbols } from './searchSymbols';
import { subscribeOnStream, unsubscribeFromStream } from './streaming';

const datafeed: IDatafeedChartApi & IExternalDatafeed = {
  onReady: (callback) => {
    setTimeout(() => callback(CHART_CONFIG), 0);
  },
  searchSymbols,
  resolveSymbol,
  getBars,
  subscribeBars: subscribeOnStream,
  unsubscribeBars: unsubscribeFromStream,
};

export default datafeed;
