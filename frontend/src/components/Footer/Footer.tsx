import { Link } from 'react-router';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to="/" className={styles.logo}>
        Zenith
      </Link>

      <nav aria-label="Footer" className={styles.nav}>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
      </nav>

      <p className={styles.copy}>© {new Date().getFullYear()}</p>
    </footer>
  );
}
