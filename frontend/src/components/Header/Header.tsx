import { Search, ShoppingCart } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import styles from './Header.module.css';

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
      <h1 className={styles.logo}>
        <Link to="/">Bazaar</Link>
      </h1>
      <form
        className={styles.searchForm}
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/shop');
        }}
      >
        <input
          className={styles.searchFormLabel}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" aria-label="Search">
          <Search size={18} aria-hidden="true" />
        </button>
      </form>
      <ul>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link
            to="/cart"
            className={styles.shoppingCart}
            aria-label={`Cart, ${cartItemCount} items`}
          >
            {cartItemCount > 0 && (
              <span className={styles.badge}>{cartItemCount}</span>
            )}
            <ShoppingCart size={18} />
          </Link>
        </li>
      </ul>
    </header>
  );
}
