import { formatPrice } from '../../utils/formatPrice';
import styles from './CartPage.module.css';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartContext } from '../../context/CartContext';
import { createCheckoutSession } from '../../api/checkout';
import { useState } from 'react';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router';

export default function CartPage() {
  const { cartState, isMutating, updateQuantity, removeFromCart } =
    useCartContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const session = await createCheckoutSession();
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
      setCheckoutError(
        'Something went wrong starting checkout. Please try again.',
      );
      setIsCheckingOut(false);
    }
  }

  if (cartState.status === 'idle') return null;
  if (cartState.status === 'loading') return <Spinner />;
  if (cartState.status === 'error') return <p>{cartState.message}</p>;

  const cart = cartState.data;

  if (cart.items.length === 0)
    return (
      <div className={styles.emptyCart}>
        <h3>You have no items in your cart.</h3>
        <Link to="/shop" className={styles.shopButton}>
          Shop Now
        </Link>
      </div>
    );

  return (
    <div>
      <h1 className={styles.cartTitle}>My Cart</h1>
      <div className={styles.cartPage}>
        <div className={styles.cart}>
          {cart.items.map((item) => (
            <div key={item.productId} className={styles.cartItem}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.productImage ?? undefined}
                  alt={item.productTitle}
                />
              </div>
              <div className={styles.itemInfo}>
                <h4>{item.productTitle}</h4>
                <p className={styles.category}>{item.productCategoryName}</p>
              </div>
              <div className={styles.cartActions}>
                <div className={styles.quantity}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isMutating}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isMutating || item.quantity >= item.productStock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeFromCart(item.id)}
                  disabled={isMutating}
                  aria-label="Remove item from cart"
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
                <p className={styles.price}>
                  {formatPrice(item.productPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          <p className={styles.orderTotal}>
            <span>Subtotal</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </p>
          {checkoutError && <p className={styles.error}>{checkoutError}</p>}
          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={isCheckingOut || isMutating}
          >
            {isCheckingOut ? 'Redirecting...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
