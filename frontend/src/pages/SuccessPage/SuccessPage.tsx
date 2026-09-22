import { CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { useOrder } from '../../hooks/useOrder';
import { formatPrice } from '../../utils/formatPrice';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get('order_id')) || undefined;
  const orderState = useOrder(orderId);

  if (orderState.status === 'loading') return <p>Confirming your order...</p>;
  if (orderState.status === 'error') return <p>{orderState.message}</p>;

  const order = orderState.data;

  return (
    <div>
      <CheckCircle2 size={64} color="#22c55e" strokeWidth={1.5} />
      <h1>Thank you for your order!</h1>
      <div>
        <p>Order #{order.id}</p>
        <h2>Order total: {formatPrice(order.totalAmount)}</h2>
      </div>

      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.productImage && (
              <img src={item.productImage} alt={item.productTitle} width={64} />
            )}
            <span>{item.productTitle}</span>
          </li>
        ))}
      </ul>

      <Link to="/orders">View order history</Link>
      <Link to="/shop">Continue shopping</Link>
    </div>
  );
}
