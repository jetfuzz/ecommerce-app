import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import styles from './ItemPage.module.css';
import { formatPrice } from '../../utils/formatPrice';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCartContext } from '../../context/CartContext';
import { useProduct } from '../../hooks/useProduct';
import Spinner from '../../components/Spinner/Spinner';

export default function ItemPage() {
  const { id } = useParams();
  const productState = useProduct(id ? Number(id) : undefined);
  const { addToCart, isMutating } = useCartContext();
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increment = () => setQuantity((prev) => prev + 1);
  const goBack = () => navigate(-1);

  if (!id) return <p className={styles.error}>Product not found.</p>;
  if (productState.status === 'loading') return <Spinner />;
  if (productState.status === 'error')
    return <p className={styles.error}>{productState.message}</p>;

  const product = productState.data;
  if (!product) return <p className={styles.error}>Product not found.</p>;

  return (
    <div className={styles.itemPage}>
      <button
        onClick={goBack}
        className={styles.arrowLeft}
        aria-label="Go back to previous page"
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
      </button>

      <div className={styles.imageWrapper}>
        <img src={product.image ?? undefined} alt={product.title} />
      </div>

      <div className={styles.itemInfo}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.category}>{product.categoryName}</p>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        {product.stock <= 5 && product.stock > 0 && (
          <p className={styles.stock}>Only {product.stock} left in stock</p>
        )}

        <div className={styles.buttonGroup}>
          <div className={styles.quantity}>
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              aria-label="Quantity"
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    product.stock,
                    Math.max(1, Number(e.target.value) || 1),
                  ),
                )
              }
            />
            <button
              onClick={increment}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <button
            className={styles.addToCart}
            onClick={() => addToCart(product.id, quantity)}
            disabled={isMutating || product.stock <= 0}
          >
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
