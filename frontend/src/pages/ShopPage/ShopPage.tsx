import { useOutletContext } from 'react-router';
import type { Product } from '../../types';
import ItemCard from '../../components/ItemCard/ItemCard';
import styles from './ShopPage.module.css';
import { useState } from 'react';

interface ShopContext {
  products: Product[];
  searchQuery: string;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'title-asc';

export default function ShopPage() {
  const { products, searchQuery } = useOutletContext<ShopContext>();
  const categories = [...new Set(products.map((p) => p.categoryName))];
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('default');

  function toggleCategory(category: string): void {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  const filteredProducts = products
    .filter((p) => selected.length === 0 || selected.includes(p.categoryName))
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className={styles.shopPage}>
      <h1 className={styles.shopTitle}>Shop</h1>

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

      <div className={styles.toolbar}>
        <p className={styles.resultCount}>
          {sortedProducts.length}{' '}
          {sortedProducts.length === 1 ? 'result' : 'results'}
          {selected.length > 0 && (
            <span className={styles.activeFilters}>
              {selected.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={styles.filterChip}
                  onClick={() => toggleCategory(category)}
                  aria-label={`Remove ${category} filter`}
                >
                  {category} ✕
                </button>
              ))}
            </span>
          )}
        </p>

        <label className={styles.sortControl}>
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Name: A to Z</option>
          </select>
        </label>
      </div>

      <div className={styles.shopItems}>
        {sortedProducts.length === 0 ? (
          <p className={styles.noResults}>No results.</p>
        ) : (
          sortedProducts.map((p) => <ItemCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}
