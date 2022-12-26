import { IDatafeedChartApi } from './datafeed-api';
import { fetchBinanceBars } from '../../../logic/binance';

export function parseFullSymbol(fullSymbol: string) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}

export const getBars: IDatafeedChartApi['getBars'] = async (
  symbolInfo,
  resolution,
  periodParams,
  onHistoryCallback,
  onErrorCallback
) => {
  const { from, to } = periodParams;
  console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  if (!parsedSymbol) {
    return onErrorCallback(`Symbol '${symbolInfo.full_name}' not parsable`);
  }
  try {
    const bars = await fetchBinanceBars(
      `${parsedSymbol.fromSymbol}/${parsedSymbol.toSymbol}`,
      from,
      to,
      resolution
    );
    const filteredBars = bars.filter(
      (b) => b.time >= from * 1000 && b.time <= to * 1000
    );
    console.log(`[getBars]: returned ${filteredBars.length} bar(s)`);
    if (filteredBars.length === 0) {
      // "noData" should be set if there is no data in the requested period.
      onHistoryCallback([], { noData: true });
      return;
    }
    onHistoryCallback(filteredBars, { noData: false });
  } catch (error: any) {
    console.log('[getBars]: Get error', error);
    onErrorCallback(error);
  }
};
