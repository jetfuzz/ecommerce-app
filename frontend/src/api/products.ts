import type { Product } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('https://localhost:7017/api/Product');
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return res.json();
}
