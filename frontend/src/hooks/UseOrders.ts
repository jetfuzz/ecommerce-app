import { useEffect, useState } from 'react';
import type { Order } from '../types';
import { fetchOrders } from '../api/orders';

type OrderState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Order[] };

export function useOrders() {
  const [state, setState] = useState<OrderState>({ status: 'loading' });

  useEffect(() => {
    (async () => {
      try {
        setState({ status: 'loading' });
        const order = await fetchOrders();
        setState({ status: 'success', data: order });
      } catch (err) {
        setState({
          status: 'error',
          message: 'Something went wrong.',
        });
        console.error(err);
      }
    })();
  }, []);

  return state;
}
