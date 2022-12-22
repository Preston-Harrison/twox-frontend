import { exchange } from './config';
import {
  Bar,
  IDatafeedChartApi,
  ResolutionString,
  SubscribeBarsCallback,
} from './datafeed-api';
import { parseFullSymbol } from './getBars';

const lastBarsCache = new Map<string, Bar>();

type Handler = {
  id: string;
  callback: SubscribeBarsCallback;
};

type Subscription = {
  subscriberUID: string;
  resolution: ResolutionString;
  lastDailyBar: Bar | undefined;
  handlers: Handler[];
};

const channelToSubscription = new Map<string, Subscription>();
// ...
export const subscribeOnStream: IDatafeedChartApi['subscribeBars'] = (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  _onResetCacheNeededCallback
) => {
  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  if (!parsedSymbol) {
    return console.error('Could not subscribe to bars', symbolInfo.full_name);
  }
  const channelString = symbolInfo.full_name;
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar: lastBarsCache.get(symbolInfo.full_name),
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  console.log(
    '[subscribeBars]: Subscribe to streaming. Channel:',
    channelString
  );
};

export const unsubscribeFromStream = (subscriberUID: string) => {
  // find a subscription with id === subscriberUID
  for (const channelString of Array.from(channelToSubscription.keys())) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem?.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1 && handlerIndex) {
      // remove from handlers
      subscriptionItem!.handlers.splice(handlerIndex, 1);

      if (subscriptionItem!.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log(
          '[unsubscribeBars]: Unsubscribe from streaming. Channel:',
          channelString
        );
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
};

export const pushPrice = (pair: string, price: number) => {
  const channelString = `${exchange}:${pair}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }
  const lastDailyBar = subscriptionItem.lastDailyBar;
  const bar: Bar = {
    open: price,
    time: Date.now(),
    ...lastDailyBar,
    high: lastDailyBar ? Math.max(lastDailyBar.high, price) : price,
    low: lastDailyBar ? Math.min(lastDailyBar.low, price) : price,
    close: price,
  };
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
  console.log('[socket] Update the latest bar by price', price);
};
