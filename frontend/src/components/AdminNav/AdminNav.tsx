import { NavLink } from 'react-router';
import styles from './AdminNav.module.css';

export default function AdminNav() {
  return (
    <nav className={styles.adminNav} aria-label="Admin">
      <NavLink
        to="/admin/products"
        className={({ isActive }) => (isActive ? styles.active : undefined)}
      >
        Products
      </NavLink>
      <NavLink
        to="/admin/categories"
        className={({ isActive }) => (isActive ? styles.active : undefined)}
      >
        Categories
      </NavLink>
    </nav>
  );
}
