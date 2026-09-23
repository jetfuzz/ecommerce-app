import { fetchProductById } from '../api/products';
import { useFetch } from './useFetch';

export function useProduct(id: number | undefined) {
  return useFetch(() => {
    if (id === undefined) throw new Error('No product id provided');
    return fetchProductById(id);
  }, [id]);
}
