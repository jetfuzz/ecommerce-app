import { fetchProducts } from '../api/products';
import { useFetch } from './useFetch';

export function useProducts() {
  return useFetch(() => fetchProducts());
}
