import { Link, useOutletContext } from 'react-router';
import styles from './HomePage.module.css';
import type { Product } from '../../types';
import ItemCard from '../../components/ItemCard/ItemCard';

interface HomePageContext {
  products: Product[];
}

function getFeaturedProducts(products: Product[]): Product[] {
  const seenCategories = new Set<string>();
  const featured: Product[] = [];
  const MIN_FEATURED_RATING = 4;

  for (const p of products) {
    if (
      !seenCategories.has(p.category) &&
      p.rating.rate > MIN_FEATURED_RATING
    ) {
      featured.push(p);
      seenCategories.add(p.category);
    }
  }

  return featured;
}

export default function HomePage() {
  const { products } = useOutletContext<HomePageContext>();
  const featured = getFeaturedProducts(products);

  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <h2>Welcome to Bazaar</h2>
        <p>Curated goods for everyday life.</p>
        <Link to="/shop" className={styles.shopButton}>
          Shop Now
        </Link>
      </section>

      <section>
        <h3>Featured Products</h3>
        <div className={styles.products}>
          {featured.map((p) => (
            <ItemCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
