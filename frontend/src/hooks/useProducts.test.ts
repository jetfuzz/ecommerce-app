import { describe, expect, it, vi } from 'vitest';
import { fetchProducts } from '../api/products';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import type { Product } from '../types';
import { createMockProduct } from '../tests/mocks';

vi.mock('../api/products');

const mockProducts: Product[] = [createMockProduct({ id: 1 })];

describe('useProduct', () => {
  it('should initially have a status of loading', () => {
    vi.mocked(fetchProducts).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProducts());

    expect(result.current.status).toBe('loading');
  });

  it('should return data and success status on successful response', async () => {
    vi.mocked(fetchProducts).mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.status).toBe('success'));

    if (result.current.status !== 'success') throw new Error('unreachable');

    expect(result.current.data).toEqual(mockProducts);
  });

  it('should display error message on failed response', async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error('Network down'));
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.status).toBe('error'));

    if (result.current.status !== 'error') throw new Error('unreachable');

    expect(result.current.message).toBe('Network down');
  });

  it('should display fallback error message on failed response and non-error message', async () => {
    vi.mocked(fetchProducts).mockRejectedValue({ status: 500 });
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.status).toBe('error'));

    if (result.current.status !== 'error') throw new Error('unreachable');

    expect(result.current.message).toBe('Something went wrong');
  });
});
