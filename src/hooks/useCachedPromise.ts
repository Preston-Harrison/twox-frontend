import * as React from 'react';

import usePromise from './usePromise';

type PromiseFactory<A, T> = (args: A) => Promise<T>;

export default function useCachedPromise<A, T>(
  factory: PromiseFactory<A, T>,
  args: A,
  dedupe = 0
) {
  const [cache, setCache] = React.useState<Record<string, T>>({});

  const cacheFirstFetch = React.useCallback(async () => {
    const serializedArgs = JSON.stringify(args);
    if (cache[serializedArgs]) {
      return cache[serializedArgs];
    }

    const data = await factory(args);
    cache[serializedArgs] = data;
    return data;
  }, [cache, args, factory]);

  const clearCache = React.useCallback(() => {
    setCache({});
  }, []);

  const { data } = usePromise(cacheFirstFetch, dedupe);

  return {
    data,
    clearCache,
  };
}
