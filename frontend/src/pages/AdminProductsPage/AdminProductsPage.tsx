import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useCategories } from '../../hooks/useCategories';
import Spinner from '../../components/Spinner/Spinner';

export default function AdminProductsPage() {
  const { state } = useAdminProducts();
  const { state: categoriesState } = useCategories();

  if (state.status === 'loading' || categoriesState.status === 'loading')
    return <Spinner />;
  if (state.status === 'error') return <p>{state.message}</p>;
  if (categoriesState.status === 'error')
    return <p>{categoriesState.message}</p>;

  return (
    <div>
      <h1>Products</h1>
    </div>
  );
}
