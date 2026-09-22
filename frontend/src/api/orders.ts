import type { Order } from '../types';
import api from './axiosInstance';

export async function fetchOrders(): Promise<Order[]> {
  const res = await api.get<Order[]>('/api/Order');
  return res.data;
}

export async function fetchOrderById(id: number): Promise<Order> {
  const res = await api.get<Order>(`/api/Order/${id}`);
  return res.data;
}
