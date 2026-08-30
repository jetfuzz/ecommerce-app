import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { fetchProducts } from '../api/products';

type ProductState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Product[] };

export function useProducts() {
  const [state, setState] = useState<ProductState>({ status: 'loading' });

  useEffect(() => {
    (async () => {
      try {
        setState({ status: 'loading' });
        const products = await fetchProducts();
        setState({ status: 'success', data: products });
      } catch (err) {
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Something went wrong',
        });
      }
    })();
  }, []);

  return state;
}
