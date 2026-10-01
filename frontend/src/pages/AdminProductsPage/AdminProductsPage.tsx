import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useCategories } from '../../hooks/useCategories';
import Spinner from '../../components/Spinner/Spinner';
import styles from '../../styles/adminPage.module.css';
import table from '../../styles/adminTable.module.css';
import { useState } from 'react';
import { ProductRow } from '../../components/ProductRow/ProductRow';
import { useConfirmDelete } from '../../hooks/useConfirmDelete';
import type { CreateProductPayload, Product } from '../../types';
import { getErrorMessage } from '../../utils/errors';
import { ProductFormDialog } from '../../components/ProductFormDialog/ProductFormDialog';
import { ConfirmDialog } from '../../components/ConfirmDialog/ConfirmDialog';

export default function AdminProductsPage() {
  const { state, isMutating, createProduct, updateProduct, deleteProduct } =
    useAdminProducts();
  const { state: categoriesState } = useCategories();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const confirmDelete = useConfirmDelete<Product>(
    (product) => deleteProduct(product.id),
    (err) => setError(getErrorMessage(err)),
  );

  async function handleSubmit(data: CreateProductPayload) {
    setError(null);
    try {
      if (editing) {
        await updateProduct(editing.id, data);
      } else {
        await createProduct(data);
      }
      setEditing(undefined);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function handleRequestDelete(id: number) {
    setError(null);
    if (state.status !== 'success') return;
    const product = state.data.find((p) => p.id === id);
    if (product) confirmDelete.request(product);
  }

  if (state.status === 'loading' || categoriesState.status === 'loading')
    return <Spinner />;
  if (state.status === 'error')
    return (
      <p className={styles.error}>{state.message}</p>
    );
  if (categoriesState.status === 'error')
    return (
      <p className={styles.error}>{categoriesState.message}</p>
    );

  const products = state.data;
  const categories = categoriesState.data;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => {
            setError(null);
            setEditing(null);
          }}
          disabled={isMutating}
        >
          Add Product
        </button>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {products.length === 0 ? (
        <p className={table.empty}>No products yet.</p>
      ) : (
        <div className={table.tableScroll}>
          <table className={table.table} aria-label="products">
            <thead>
              <tr>
                <th className={table.headCell} scope="col">
                  ID
                </th>
                <th className={table.headCell} scope="col">
                  Image
                </th>
                <th className={table.headCell} scope="col">
                  Title
                </th>
                <th className={table.headCell} scope="col">
                  Description
                </th>
                <th className={table.headCell} scope="col">
                  Category
                </th>
                <th className={table.headCell} scope="col">
                  Price
                </th>
                <th className={table.headCell} scope="col">
                  Stock
                </th>
                <th className={table.headCell} scope="col">
                  <span className={table.visuallyHidden}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={(product) => {
                    setError(null);
                    setEditing(product);
                  }}
                  onDelete={handleRequestDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== undefined && (
        <ProductFormDialog
          product={editing}
          categories={categories}
          isMutating={isMutating}
          submitError={error}
          onCancel={() => setEditing(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {confirmDelete.pending && (
        <ConfirmDialog
          title="Delete product?"
          description={`Are you sure you want to delete ${confirmDelete.pending.title}?`}
          isMutating={isMutating}
          onConfirm={confirmDelete.confirm}
          onCancel={confirmDelete.cancel}
        />
      )}
    </div>
  );
}
