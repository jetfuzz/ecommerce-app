import { useEffect, useState } from 'react';
import type { AsyncState, CreateProductPayload, Product } from '../types';
import {
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  fetchProducts,
} from '../api/products';
import { getErrorMessage } from '../utils/errors';

export function useAdminProducts() {
  const [isMutating, setIsMutating] = useState(false);
  const [state, setState] = useState<AsyncState<Product[]>>({
    status: 'loading',
  });

  useEffect(() => {
    (async () => {
      try {
        const products = await fetchProducts();
        setState({ status: 'success', data: products });
      } catch (err) {
        setState({ status: 'error', message: getErrorMessage(err) });
      }
    })();
  }, []);

  async function createProduct(data: CreateProductPayload) {
    setIsMutating(true);
    try {
      const newProduct = await createProductApi(data);
      setState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          data: [...prev.data, newProduct],
        };
      });
    } catch (err) {
      setState({
        status: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function updateProduct(id: number, data: CreateProductPayload) {
    setIsMutating(true);
    try {
      const updatedProduct = await updateProductApi(id, data);
      setState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          data: prev.data.map((item) =>
            item.id === id ? updatedProduct : item,
          ),
        };
      });
    } catch (err) {
      setState({
        status: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteProduct(id: number) {
    setIsMutating(true);
    try {
      await deleteProductApi(id);
      setState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          data: prev.data.filter((p) => p.id !== id),
        };
      });
    } catch (err) {
      setState({
        status: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setIsMutating(false);
    }
  }

  return { state, isMutating, createProduct, updateProduct, deleteProduct };
}
