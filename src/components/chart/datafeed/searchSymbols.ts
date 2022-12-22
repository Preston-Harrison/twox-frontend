import { IDatafeedChartApi } from './datafeed-api';
import { getAllSymbols } from './resolveSymbol';

export const searchSymbols: IDatafeedChartApi['searchSymbols'] = async (
  userInput,
  exchange,
  _symbolType,
  onResultReadyCallback
) => {
  console.log('[searchSymbols]: Method call');
  const symbols = await getAllSymbols();
  const newSymbols = symbols.filter((symbol) => {
    const isExchangeValid = exchange === '' || symbol.exchange === exchange;
    const isFullSymbolContainsInput =
      symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
    return isExchangeValid && isFullSymbolContainsInput;
  });
  onResultReadyCallback(newSymbols);
};
