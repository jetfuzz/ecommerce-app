import type { Cart } from '../types';
import api from './axiosInstance';

export async function fetchCart(): Promise<Cart> {
  const res = await api.get<Cart>('/api/Cart');
  return res.data;
}

export async function addCartItem(productId: number, quantity: number) {
  const res = await api.post<Cart>('/api/Cart/items', { productId, quantity });
  return res.data;
}

export async function updateCartItem(itemId: number, quantity: number) {
  const res = await api.put<Cart>(`/api/Cart/items/${itemId}`, { quantity });
  return res.data;
}

export async function removeCartItem(itemId: number) {
  const res = await api.delete<Cart>(`/api/Cart/items/${itemId}`);
  return res.data;
}
