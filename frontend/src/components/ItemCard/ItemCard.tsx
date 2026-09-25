import { Link } from 'react-router';
import type { Product } from '../../types';
import styles from './ItemCard.module.css';
import { formatPrice } from '../../utils/formatPrice';
import { useCartContext } from '../../context/CartContext';

interface ItemCardProps {
  product: Product;
}

export default function ItemCard({ product }: ItemCardProps) {
  const { addToCart, isMutating } = useCartContext();

  return (
    <div className={styles.card}>
      <Link
        to={`/shop/${product.id}`}
        className={styles.imageWrapper}
        aria-hidden="true"
        tabIndex={-1}
      >
        <img
          src={product.image ?? undefined}
          alt=""
          className={styles.productImg}
        />
      </Link>

      <div className={styles.detailsContainer}>
        <div className={styles.details}>
          <Link to={`/shop/${product.id}`} className={styles.titleLink}>
            <h2 className={styles.productTitle}>{product.title}</h2>
          </Link>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <button
          className={styles.button}
          disabled={isMutating || product.stock <= 0}
          onClick={() => addToCart(product.id, 1)}
        >
          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
