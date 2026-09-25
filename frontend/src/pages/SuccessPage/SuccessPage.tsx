import { CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { useOrder } from '../../hooks/useOrder';
import { formatPrice } from '../../utils/formatPrice';
import Spinner from '../../components/Spinner/Spinner';
import styles from './SuccessPage.module.css';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get('order_id')) || undefined;
  const orderState = useOrder(orderId);

  if (orderState.status === 'loading') return <Spinner />;
  if (orderState.status === 'error')
    return <p className={styles.error}>{orderState.message}</p>;

  const order = orderState.data;

  return (
    <div className={styles.page}>
      <CheckCircle2
        size={40}
        strokeWidth={1.5}
        className={styles.icon}
        aria-hidden="true"
      />
      <h1 className={styles.heading}>Thank you for your order!</h1>

      <div className={styles.summary}>
        <p className={styles.orderId}>Order #{order.id}</p>
        <p className={styles.orderTotal}>
          <span>Order total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </p>
      </div>

      <ul className={styles.items}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.productImage && (
              <img
                src={item.productImage}
                alt={item.productTitle}
                className={styles.itemImage}
              />
            )}
            <span>{item.productTitle}</span>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Link to="/orders" className={styles.secondaryButton}>
          View order history
        </Link>
        <Link to="/shop" className={styles.primaryButton}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
