import type { Product } from '../types';
import api from './axiosInstance';

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>('/api/Product');
  return res.data;
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await api.get<Product>(`/api/Product/${id}`);
  return res.data;
}
