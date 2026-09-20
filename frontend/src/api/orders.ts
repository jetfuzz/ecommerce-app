import type { Order } from '../types';
import api from './axiosInstance';

export async function fetchOrderById(id: number): Promise<Order> {
  const res = await api.get<Order>(`/api/Order/${id}`);
  return res.data;
}
