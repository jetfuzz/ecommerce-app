import { Link } from 'react-router';
import Spinner from '../../components/Spinner/Spinner';
import { useOrders } from '../../hooks/UseOrders';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

export default function OrdersPage() {
  const orderState = useOrders();

  if (orderState.status === 'loading') return <Spinner />;
  if (orderState.status === 'error') return <p>{orderState.message}</p>;

  const orders = orderState.data;

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length === 0 && <p>You haven't placed any orders yet.</p>}

      <div>
        {orders.map((order) => {
          const [firstItem] = order.items;

          return (
            <div key={order.id}>
              <p>Order Placed {formatDate(order.createdAt)}</p>
              <p>Total {formatPrice(order.totalAmount)}</p>
              <p>Order # {order.id}</p>
              <p>Order status {order.status}</p>
              <div>
                {firstItem.productImage && (
                  <img
                    src={firstItem.productImage}
                    alt={firstItem.productTitle}
                    width={64}
                  />
                )}
                {firstItem.productTitle}
              </div>
              <Link to={`/order/${order.id}`}>View Order Details</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
