import type { Category } from '../types';
import api from './axiosInstance';

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>('/api/Category');
  return res.data;
}

export async function updateCategory(
  id: number,
  name: string,
): Promise<Category> {
  const res = await api.put<Category>(`/api/Category/${id}`, { name });
  return res.data;
}

export async function createCategory(name: string): Promise<Category> {
  const res = await api.post<Category>('/api/Category', { name });
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/Category/${id}`);
}
