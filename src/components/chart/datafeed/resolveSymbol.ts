import config, { exchange } from './config';
import {
  IDatafeedChartApi,
  LibrarySymbolInfo,
  SearchSymbolResultItem,
} from './datafeed-api';
import { fetchAggregatorPairMap } from '../../../logic/api';

export type SearchSymbolResult = SearchSymbolResultItem & {
  aggregator: string;
};

export async function getAllSymbols(): Promise<SearchSymbolResult[]> {
  const aggregatorToPair = await fetchAggregatorPairMap();
  return Object.entries(aggregatorToPair).map(([aggregator, pair]) => {
    return {
      ticker: `${exchange}:${pair}`,
      symbol: pair,
      full_name: `${exchange}:${pair}`,
      description: pair,
      exchange: exchange,
      type: 'crypto',
      aggregator,
    };
  });
}

export const resolveSymbol: IDatafeedChartApi['resolveSymbol'] = async (
  fullName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
  _extension
) => {
  console.log('[resolveSymbol]: Method call', fullName);
  const symbols = await getAllSymbols();
  const symbolItem = symbols.find(({ full_name }) =>
    full_name.endsWith(fullName)
  );
  if (!symbolItem) {
    console.log('[resolveSymbol]: Cannot resolve symbol', fullName);
    onResolveErrorCallback('cannot resolve symbol');
    return;
  }
  const symbolInfo: LibrarySymbolInfo = {
    ticker: symbolItem.full_name,
    full_name: fullName,
    format: 'price',
    listed_exchange: symbolItem.exchange,
    name: symbolItem.symbol,
    description: symbolItem.description,
    type: symbolItem.type,
    session: '24x7',
    timezone: 'Etc/UTC',
    exchange: symbolItem.exchange,
    minmov: 1,
    pricescale: 100,
    has_intraday: false,
    has_weekly_and_monthly: false,
    supported_resolutions: config.supported_resolutions,
    volume_precision: 2,
    data_status: 'streaming',
  };

  console.log('[resolveSymbol]: Symbol resolved', fullName);
  onSymbolResolvedCallback(symbolInfo);
};
