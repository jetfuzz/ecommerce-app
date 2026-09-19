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
      <Link to={`/shop/${product.id}`} className={styles.imageWrapper}>
        <img
          src={product.image ?? undefined}
          alt={product.title}
          className={styles.productImg}
        />
      </Link>
      <Link to={`/shop/${product.id}`}>
        <h2 className={styles.productTitle}>{product.title}</h2>
      </Link>
      <p className={styles.price}>{formatPrice(product.price)}</p>
      <button disabled={isMutating} onClick={() => addToCart(product.id, 1)}>Add to cart</button>
    </div>
  );
}
