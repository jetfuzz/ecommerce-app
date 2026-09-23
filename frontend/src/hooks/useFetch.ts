import { useEffect, useState } from 'react';
import type { AsyncState } from '../types';
import { getErrorMessage } from '../utils/errors';

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setState({ status: 'loading' });
        const data = await fetcher();
        if (!cancelled) setState({ status: 'success', data });
      } catch (err) {
        if (!cancelled)
          setState({ status: 'error', message: getErrorMessage(err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}
