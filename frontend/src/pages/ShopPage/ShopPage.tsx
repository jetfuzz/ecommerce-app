import { useOutletContext } from 'react-router';
import type { Product } from '../../types';
import ItemCard from '../../components/ItemCard/ItemCard';
import styles from './ShopPage.module.css';
import { useState } from 'react';

interface ShopContext {
  products: Product[];
  searchQuery: string;
}

export default function ShopPage() {
  const { products, searchQuery } = useOutletContext<ShopContext>();
  const categories = [...new Set(products.map((p) => p.category))];
  const [selected, setSelected] = useState<string[]>([]);

  function toggleCategory(category: string): void {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  const filteredProducts = products
    .filter((p) => selected.length === 0 || selected.includes(p.category))
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={styles.shopPage}>
      <h2 className={styles.shopTitle}>Shop</h2>

      <fieldset className={styles.categoryFilter}>
        <legend>Categories</legend>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={selected.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            {category}
          </label>
        ))}
      </fieldset>

      <div className={styles.shopItems}>
        {filteredProducts.length === 0 ? (
          <p>No results.</p>
        ) : (
          filteredProducts.map((p) => <ItemCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}
