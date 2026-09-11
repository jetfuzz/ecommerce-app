import { Link } from 'react-router';
import type { Product } from '../../types';
import styles from './ItemCard.module.css';
import { formatPrice } from '../../utils/formatPrice';
import { useCartContext } from '../../context/CartContext';

interface ItemCardProps {
  product: Product;
}

export default function ItemCard({ product }: ItemCardProps) {
  const { addToCart } = useCartContext();

  return (
    <div className={styles.card}>
      <Link to={`/shop/${product.id}`}>
        <img
          src={product.image ?? undefined}
          alt={product.title}
          className={styles.productImg}
        />
      </Link>
      <Link to={`/shop/${product.id}`}>
        <h2 className={styles.productTitle}>{product.title}</h2>
      </Link>
      {/* <div className={styles.rating}>
        <Star fill="currentColor" size={14} />
        <p>
          {product.rating.rate} ({product.rating.count})
        </p>
      </div> */}
      <p className={styles.price}>{formatPrice(product.price)}</p>
      <button onClick={() => addToCart(product.id, 1)}>Add to cart</button>
    </div>
  );
}
