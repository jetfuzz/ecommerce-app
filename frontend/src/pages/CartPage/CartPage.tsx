import type { Cart } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartPage.module.css';
import { Trash2 } from 'lucide-react';
import { useCartContext } from '../../context/CartContext';
import { createCheckoutSession } from '../../api/checkout';
import { useState } from 'react';

const TAX_RATE = 0.13;

interface OrderSummary {
  subtotal: number;
  total: number;
  tax: number;
}

function getTotal(cart: Cart): OrderSummary {
  const subtotal = cart.subtotal;
  const tax = subtotal * TAX_RATE;
  return { subtotal, tax, total: subtotal + tax };
}

export default function CartPage() {
  const { cartState, updateQuantity, removeFromCart } = useCartContext();
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
  if (cartState.status === 'loading') return <p>Loading...</p>;
  if (cartState.status === 'error') return <p>{cartState.message}</p>;

  const cart = cartState.data;
  const { subtotal, tax, total } = getTotal(cart);

  if (cart.items.length === 0) return <p>Your shopping cart is empty</p>;

  return (
    <div>
      <h2 className={styles.cartTitle}>Shopping Bag</h2>
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
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={18} />
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
          <p>Subtotal: {formatPrice(subtotal)}</p>
          <p>Tax: {formatPrice(tax)}</p>
          <hr />
          <p className={styles.orderTotal}>Total: {formatPrice(total)}</p>
          {/* missing styles.error */}
          {checkoutError && <p className={styles.error}>{checkoutError}</p>}
          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Redirecting...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
