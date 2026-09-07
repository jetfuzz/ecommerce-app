import type { Product } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Product`);
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return res.json();
}
