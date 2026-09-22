import { Link, useNavigate, useParams } from 'react-router';
import { useOrder } from '../../hooks/useOrder';
import Spinner from '../../components/Spinner/Spinner';
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderState = useOrder(id ? Number(id) : undefined);
  const navigate = useNavigate();
  const goBack = () => navigate('/orders');

  if (!id) return <p>Order not found.</p>;
  if (orderState.status === 'loading') return <Spinner />;
  if (orderState.status === 'error') return <p>{orderState.message}</p>;

  const order = orderState.data;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <button
        onClick={goBack}
        // className={styles.arrowLeft}
        aria-label="Back to orders"
      >
        <ArrowLeft />
      </button>

      <h1>Order Details</h1>
      <p>Order placed {formatDate(order.createdAt)}</p>
      <p>Order number {order.id}</p>
      <p>Order total {formatPrice(order.totalAmount)}</p>
      <p>Order status {order.status}</p>
      {order.items.map((item) => (
        <div key={item.id}>
          {item.productImage && (
            <Link to={`/shop/${item.productId}`}>
              <img src={item.productImage} alt={item.productTitle} width={64} />
            </Link>
          )}
          <h2>
            <Link to={`/shop/${item.productId}`}>{item.productTitle}</Link>
          </h2>
          {item.quantity > 1 && <p>{item.quantity}</p>}
          <p>{item.priceAtPurchase}</p>
        </div>
      ))}
    </div>
  );
}
