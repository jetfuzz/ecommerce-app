import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { fetchProductById } from '../api/products';

type ProductState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Product };

export function useProduct(id: number | undefined) {
  const [state, setState] = useState<ProductState>({ status: 'loading' });

  useEffect(() => {
    if (id === undefined) {
      setState({ status: 'error', message: 'No product id provided' });
      return;
    }
    (async () => {
      try {
        setState({ status: 'loading' });
        const product = await fetchProductById(id);
        setState({ status: 'success', data: product });
      } catch (err) {
        setState({
          status: 'error',
          message: 'Something went wrong loading this product.',
        });
        console.error(err);
      }
    })();
  }, [id]);

  return state;
}
