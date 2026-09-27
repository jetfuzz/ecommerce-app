import type { CreateProductPayload, Product } from '../types';
import api from './axiosInstance';

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>('/api/Product');
  return res.data;
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await api.get<Product>(`/api/Product/${id}`);
  return res.data;
}

export async function updateProduct(
  id: number,
  data: CreateProductPayload,
): Promise<Product> {
  const res = await api.put<Product>(`/api/Product/${id}`, data);
  return res.data;
}

export async function createProduct(
  data: CreateProductPayload,
): Promise<Product> {
  const res = await api.post<Product>('/api/Product', data);
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/api/Product/${id}`);
}
