import { useEffect, useState } from 'react';
import type { Order } from '../types';
import { fetchOrderById } from '../api/orders';

type OrderState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Order };

export function useOrder(id: number | undefined) {
  const [state, setState] = useState<OrderState>({ status: 'loading' });

  useEffect(() => {
    if (id === undefined) {
      setState({ status: 'error', message: 'No order id provided' });
      return;
    }
    (async () => {
      try {
        setState({ status: 'loading' });
        const order = await fetchOrderById(id);
        setState({ status: 'success', data: order });
      } catch (err) {
        setState({
          status: 'error',
          message: 'Something went wrong loading this order.',
        });
        console.error(err);
      }
    })();
  }, [id]);

  return state;
}
