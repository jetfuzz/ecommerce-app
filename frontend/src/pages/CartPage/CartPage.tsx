import type { Cart } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartPage.module.css';
import { Trash2 } from 'lucide-react';
import { useCartContext } from '../../context/CartContext';

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
          <button
            className={styles.checkoutBtn}
            onClick={() =>
              window.alert(
                "Congrats! If this were a real shop, you'd have just placed an order 😁",
              )
            }
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
