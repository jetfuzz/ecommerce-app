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
        <img
          className={styles.heroImg}
          src="/giacomo-berardi-vDZHL3klJsQ-unsplash.jpg"
          alt="Skier ascending a snow ridge"
        />
        <div className={styles.heroInner}>
          <p className={styles.label}>FW26 / Collection 01</p>
          <h1>Explore Further</h1>
          <p className={styles.sub}>Gear built for wherever you're headed.</p>
          <Link to="/shop" className={styles.shopButton}>
            Shop Collection
          </Link>
        </div>
        <p className={styles.credit}>
          Photo by{' '}
          <a href="https://unsplash.com/@giacbrd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Giacomo Berardi
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com/photos/grayscale-photo-of-man-on-mountain-vDZHL3klJsQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </p>
      </section>

      <section>
        <h3 className={styles.sectionTitle}>Featured Products</h3>
        <div className={styles.products}>
          {products.slice(0, 5).map((p) => (
            <ItemCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}