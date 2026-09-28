import { useEffect, useState } from 'react';
import type { AsyncState, Category } from '../types';
import {
  fetchCategories,
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from '../api/categories';
import { getErrorMessage } from '../utils/errors';

export function useCategories() {
  const [state, setState] = useState<AsyncState<Category[]>>({
    status: 'loading',
  });
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setState({ status: 'loading' });
        const categories = await fetchCategories();
        setState({ status: 'success', data: categories });
      } catch (err) {
        setState({
          status: 'error',
          message: getErrorMessage(err),
        });
      }
    })();
  }, []);

  async function createCategory(name: string) {
    setIsMutating(true);
    try {
      const newCategory = await createCategoryApi(name);
      setState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          data: [...prev.data, newCategory],
        };
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function updateCategory(id: number, name: string) {
    setIsMutating(true);
    try {
      const updatedCategory = await updateCategoryApi(id, name);
      setState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          data: prev.data.map((item) =>
            item.id === id ? updatedCategory : item,
          ),
        };
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteCategory(id: number) {
    setIsMutating(true);
    try {
      await deleteCategoryApi(id);
      setState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          data: prev.data.filter((c) => c.id !== id),
        };
      });
    } finally {
      setIsMutating(false);
    }
  }

  return { state, isMutating, createCategory, updateCategory, deleteCategory };
}
