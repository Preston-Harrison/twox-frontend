import * as React from 'react';

export type PromiseFactory<T> = () => Promise<T>;

export default function usePromise<T>(factory: PromiseFactory<T>, dedupe = 0) {
  const [data, setData] = React.useState<T>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<any>();

  const refresh = React.useCallback(async () => {
    setError(undefined);
    setLoading(true);

    try {
      const newData = await factory();
      setData(newData);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [factory]);

  React.useEffect(() => {
    setLoading(true);
    const id = setTimeout(refresh, dedupe);
    return () => clearTimeout(id);
  }, [refresh, dedupe]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
