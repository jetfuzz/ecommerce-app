import { Link, useOutletContext } from 'react-router';
import styles from './HomePage.module.css';
import type { Product } from '../../types';
import ItemCard from '../../components/ItemCard/ItemCard';

interface HomePageContext {
  products: Product[];
}

export default function HomePage() {
  const { products } = useOutletContext<HomePageContext>();

  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <h1>Welcome to Bazaar</h1>
        <p>Curated goods for everyday life.</p>
        <Link to="/shop" className={styles.shopButton}>
          Shop Now
        </Link>
      </section>

      <section>
        <h3>Featured Products</h3>
        <div className={styles.products}>
          {products.slice(0, 5).map((p) => (
            <ItemCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
