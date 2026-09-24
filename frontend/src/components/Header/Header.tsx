import { Search, ShoppingCart } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import styles from './Header.module.css';
import UserMenu from '../UserMenu/UserMenu';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItemCount: number;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  cartItemCount,
}: HeaderProps) {
  const navigate = useNavigate();

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>): void {
    setSearchQuery(e.target.value);
  }

  return (
    <header className={styles.header}>
      <nav aria-label="Primary">
        <ul className={styles.list}>
          <li className={styles.logo}>
            <Link to="/">Zenith</Link>
          </li>
          <li>
            <NavLink
              to="/shop"
              className={styles.navLink}
            >
              Shop
            </NavLink>
          </li>
        </ul>
      </nav>

      <form
        className={styles.searchForm}
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/shop');
        }}
      >
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search products"
        />
        <button type="submit" aria-label="Search">
          <Search size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </form>

      <ul className={`${styles.list} ${styles.actions}`}>
        <li>
          <Link
            to="/cart"
            className={styles.shoppingCart}
            aria-label={`Cart, ${cartItemCount} items`}
          >
            {cartItemCount > 0 && (
              <span className={styles.badge}>{cartItemCount}</span>
            )}
            <ShoppingCart size={18} strokeWidth={1.5} />
          </Link>
        </li>
        <li>
          <UserMenu />
        </li>
      </ul>
    </header>
  );
}