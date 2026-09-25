import { Link, useNavigate, useParams } from 'react-router';
import { useOrder } from '../../hooks/useOrder';
import Spinner from '../../components/Spinner/Spinner';
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import styles from './OrderDetailPage.module.css';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderState = useOrder(id ? Number(id) : undefined);
  const navigate = useNavigate();
  const goBack = () => navigate('/orders');

  if (!id) return <p className={styles.error}>Order not found.</p>;
  if (orderState.status === 'loading') return <Spinner />;
  if (orderState.status === 'error')
    return <p className={styles.error}>{orderState.message}</p>;

  const order = orderState.data;
  if (!order) return <p className={styles.error}>Order not found.</p>;

  return (
    <div className={styles.page}>
      <button
        onClick={goBack}
        className={styles.arrowLeft}
        aria-label="Back to orders"
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
      </button>

      <h1 className={styles.title}>Order Details</h1>

      <div className={styles.meta}>
        <div>
          <p className={styles.label}>Order Placed</p>
          <p className={styles.value}>{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className={styles.label}>Total</p>
          <p className={styles.value}>{formatPrice(order.totalAmount)}</p>
        </div>
        <div>
          <p className={styles.label}>Order #</p>
          <p className={styles.value}>{order.id}</p>
        </div>
        <div>
          <p className={styles.label}>Status</p>
          <p className={styles.status} data-status={order.status.toLowerCase()}>
            {order.status}
          </p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>
        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
      </h2>

      <ul className={styles.items}>
        {order.items.map((item) => {
          // A product can be deleted after purchase, which nulls productId —
          // so only link when the destination still exists.
          const image = item.productImage ? (
            <img
              src={item.productImage}
              alt={item.productTitle}
              className={styles.itemImage}
            />
          ) : null;

          return (
            <li key={item.id} className={styles.item}>
              {image &&
                (item.productId ? (
                  <Link
                    to={`/shop/${item.productId}`}
                    className={styles.imageLink}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {image}
                  </Link>
                ) : (
                  <span className={styles.imageLink}>{image}</span>
                ))}

              <div className={styles.itemInfo}>
                {item.productId ? (
                  <Link
                    to={`/shop/${item.productId}`}
                    className={styles.itemTitle}
                  >
                    {item.productTitle}
                  </Link>
                ) : (
                  <span className={styles.itemTitle}>{item.productTitle}</span>
                )}
                <p className={styles.itemMeta}>
                  {item.quantity} &times; {formatPrice(item.priceAtPurchase)}
                </p>
              </div>

              <p className={styles.itemPrice}>
                {formatPrice(item.priceAtPurchase * item.quantity)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className={styles.total}>
        <span>Order Total</span>
        <span>{formatPrice(order.totalAmount)}</span>
      </div>
    </div>
  );
}
