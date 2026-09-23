import { fetchOrders } from '../api/orders';
import { useFetch } from './useFetch';

export function useOrders() {
  return useFetch(() => fetchOrders());
}
