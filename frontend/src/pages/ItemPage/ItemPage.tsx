import { useNavigate, useOutletContext, useParams } from 'react-router';
import type { Product } from '../../types';
import { useState } from 'react';
import styles from './ItemPage.module.css';
import { formatPrice } from '../../utils/formatPrice';
import { ArrowLeft, Star } from 'lucide-react';

interface ItemPageContext {
  products: Product[];
  addToCart: (product: Product, quantity?: number) => void;
}

export default function ItemPage() {
  const { id } = useParams();
  const { products, addToCart } = useOutletContext<ItemPageContext>();
  const [quantity, setQuantity] = useState<number>(1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increment = () => setQuantity((prev) => prev + 1);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  if (!id) return <p>Product not found.</p>;
  const product = products.find((p) => p.id === Number(id));
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <button
        onClick={goBack}
        className={styles.arrowLeft}
        aria-label="Go back to previous page"
      >
        <ArrowLeft />
      </button>
      <div className={styles.itemPage}>
        <div className={styles.imageWrapper}>
          <img src={product.image} alt={product.title} />
        </div>
        <div className={styles.itemInfo}>
          <h2>{product.title}</h2>
          <p className={styles.category}>{product.category}</p>
          <p>{product.description}</p>
          <div className={styles.rating}>
            <Star fill="currentColor" size={14} />
            <p>
              {product.rating.rate} ({product.rating.count})
            </p>
          </div>
          <p className={styles.price}>{formatPrice(product.price)}</p>

          <div className={styles.buttonGroup}>
            <div className={styles.quantity}>
              <button onClick={decrement} disabled={quantity <= 1}>
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
              />
              <button onClick={increment}>+</button>
            </div>
            <button
              className={styles.addToCart}
              onClick={() => addToCart(product, quantity)}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
