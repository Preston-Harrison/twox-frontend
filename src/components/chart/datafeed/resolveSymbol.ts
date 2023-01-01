import {
  IDatafeedChartApi,
  LibrarySymbolInfo,
  SearchSymbolResultItem,
} from './datafeed-api';
import { CHART_CONFIG, EXCHANGE_NAME } from '../../../config';
import { fetchAggregatorData } from '../../../logic/api';

export type SearchSymbolResult = SearchSymbolResultItem & {
  aggregator: string;
};

export async function getAllSymbols(): Promise<SearchSymbolResult[]> {
  const aggregatorData = await fetchAggregatorData();
  return Object.entries(aggregatorData).map(([aggregator, { pair }]) => {
    return {
      ticker: `${EXCHANGE_NAME}:${pair}`,
      symbol: pair,
      full_name: `${EXCHANGE_NAME}:${pair}`,
      description: pair,
      exchange: EXCHANGE_NAME,
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
    pricescale: 10 ** 4,
    has_intraday: true,
    has_weekly_and_monthly: true,
    supported_resolutions: CHART_CONFIG.supported_resolutions,
    volume_precision: 2,
    data_status: 'streaming',
  };

  console.log('[resolveSymbol]: Symbol resolved', fullName);
  onSymbolResolvedCallback(symbolInfo);
};
