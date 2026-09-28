import { useCategories } from '../../hooks/useCategories';
import Spinner from '../../components/Spinner/Spinner';
import { CategoryRow } from '../../components/CategoryRow/CategoryRow';
import { useState } from 'react';
import { getErrorMessage } from '../../utils/errors';
import type { Category } from '../../types';
import { ConfirmDialog } from '../../components/ConfirmDialog/ConfirmDialog';
import { useConfirmDelete } from '../../hooks/useConfirmDelete';
import table from '../../styles/adminTable.module.css';
import styles from './AdminCategoriesPage.module.css';
import { NewCategoryRow } from '../../components/NewCategoryRow/NewCategoryRow';

export default function AdminCategoriesPage() {
  const { state, isMutating, createCategory, updateCategory, deleteCategory } =
    useCategories();
  const [error, setError] = useState<string | null>(null);
  const confirmDelete = useConfirmDelete<Category>(
    (category) => deleteCategory(category.id),
    (err) => setError(getErrorMessage(err)),
  );
  const [isAdding, setIsAdding] = useState(false);

  async function handleCreate(name: string) {
    setIsAdding(true);
    try {
      await createCategory(name);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }

  async function handleEdit(id: number, name: string) {
    setError(null);
    try {
      await updateCategory(id, name);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }

  function handleRequestDelete(id: number) {
    setError(null);
    if (state.status !== 'success') return;
    const category = state.data.find((c) => c.id === id);
    if (category) confirmDelete.request(category);
  }

  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'error')
    return (
      <p className={styles.error} role="alert">
        {state.message}
      </p>
    );

  const categories = state.data;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <button
          type="button" 
          className={styles.addButton}
          onClick={() => { setError(null); setIsAdding(true); }}
          disabled={isAdding}
        >
          Add Category
        </button>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {categories.length === 0 ? (
        <p className={table.empty}>No categories yet.</p>
      ) : (
        <table className={table.table} aria-label="categories">
          <thead>
            <tr>
              <th className={table.headCell} scope="col">
                ID
              </th>
              <th className={table.headCell} scope="col">
                Name
              </th>
              <th className={table.headCell} scope="col">
                <span className={table.visuallyHidden}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                isMutating={isMutating}
                onUpdate={handleEdit}
                onDelete={handleRequestDelete}
              />
            ))}
            {isAdding && (
              <NewCategoryRow
                isMutating={isMutating}
                onCreate={handleCreate}
                onClose={() => setIsAdding(false)}
              />
            )}
          </tbody>
        </table>
      )}

      {confirmDelete.pending && (
        <ConfirmDialog
          title="Delete category?"
          description={`Are you sure you want to delete ${confirmDelete.pending.name}?`}
          isMutating={isMutating}
          onConfirm={confirmDelete.confirm}
          onCancel={confirmDelete.cancel}
        />
      )}
    </div>
  );
}
