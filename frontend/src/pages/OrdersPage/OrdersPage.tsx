import { Link } from 'react-router';
import Spinner from '../../components/Spinner/Spinner';
import { useOrders } from '../../hooks/useOrders';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import styles from './OrdersPage.module.css';

export default function OrdersPage() {
  const orderState = useOrders();

  if (orderState.status === 'loading') return <Spinner />;
  if (orderState.status === 'error')
    return <p className={styles.error}>{orderState.message}</p>;

  const orders = orderState.data;

  return (
    <div className={styles.ordersPage}>
      <h1 className={styles.title}>Your Orders</h1>

      {orders.length === 0 ? (
        <p className={styles.empty}>You haven't placed any orders yet.</p>
      ) : (
        <ul className={styles.ordersContainer}>
          {orders.map((order) => {
            const [firstItem, ...moreItems] = order.items;

            return (
              <li key={order.id} className={styles.order}>
                <div className={styles.orderDetails}>
                  <div>
                    <p className={styles.label}>Order Placed</p>
                    <p className={styles.value}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className={styles.label}>Total</p>
                    <p className={styles.value}>
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className={styles.label}>Order #</p>
                    <p className={styles.value}>{order.id}</p>
                  </div>
                  <div>
                    <p className={styles.label}>Status</p>
                    <p
                      className={styles.status}
                      data-status={order.status.toLowerCase()}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className={styles.itemPreview}>
                  {firstItem.productImage && (
                    <img
                      src={firstItem.productImage}
                      alt={firstItem.productTitle}
                      className={styles.itemImage}
                    />
                  )}
                  <span className={styles.productTitleSection}>
                    {firstItem.productTitle}
                    {moreItems.length > 0 && (
                      <span className={styles.moreItems}>
                        +{moreItems.length} more
                      </span>
                    )}
                  </span>
                </div>

                <Link to={`/order/${order.id}`} className={styles.viewButton}>
                  View Order Details
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
