import type { Product } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products');
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return res.json();
}
