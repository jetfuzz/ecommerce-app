import { useOutletContext } from 'react-router';
import type { CartItem } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartPage.module.css';
import { Trash2 } from 'lucide-react';

const TAX_RATE = 0.13;

interface CartContext {
  cart: CartItem[];
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}

interface OrderSummary {
  subtotal: number;
  total: number;
  tax: number;
}

function getTotal(cartItems: CartItem[]): OrderSummary {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );
  const tax = subtotal * TAX_RATE;
  return { subtotal, tax, total: subtotal + tax };
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } =
    useOutletContext<CartContext>();
  const { subtotal, tax, total } = getTotal(cart);

  if (cart.length === 0) return <p>Your shopping cart is empty</p>;
  return (
    <div>
      <h2 className={styles.cartTitle}>Shopping Bag</h2>
      <div className={styles.cartPage}>
        <div className={styles.cart}>
          {cart.map((item) => (
            <div key={item.product.id} className={styles.cartItem}>
              <div className={styles.imageWrapper}>
                <img src={item.product.image} alt={item.product.title} />
              </div>
              <div className={styles.itemInfo}>
                <h4>{item.product.title}</h4>
                <p className={styles.category}>{item.product.category}</p>
              </div>
              <div className={styles.cartActions}>
                <div className={styles.quantity}>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Trash2 size={18} />
                </button>
                <p className={styles.price}>
                  {formatPrice(item.product.price * item.quantity)}
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
