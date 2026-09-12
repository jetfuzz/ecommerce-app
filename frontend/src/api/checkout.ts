import api from './axiosInstance';

export async function createCheckoutSession() {
  const res = await api.post('/api/Checkout');
  return res.data;
}
