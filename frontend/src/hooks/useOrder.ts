import { fetchOrderById } from '../api/orders';
import { useFetch } from './useFetch';

export function useOrder(id: number | undefined) {
  return useFetch(
    () => {
      if (id === undefined) throw new Error('No product id provided');
      return fetchOrderById(id);
    },
    [id],
  );
}
