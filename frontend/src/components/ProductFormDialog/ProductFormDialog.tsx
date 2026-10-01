import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react';
import type { Category, CreateProductPayload, Product } from '../../types';
import styles from './ProductFormDialog.module.css';

interface ProductFormDialogProps {
  product?: Product | null;
  categories: Category[];
  isMutating: boolean;
  onSubmit: (data: CreateProductPayload) => Promise<void>;
  onCancel: () => void;
  submitError?: string | null;
}

function toPayload(product: Product): CreateProductPayload {
  return {
    title: product.title,
    price: product.price,
    description: product.description,
    categoryId: product.categoryId,
    image: product.image,
    stock: product.stock,
  };
}

const defaultValues: CreateProductPayload = {
  title: '',
  price: 0,
  description: '',
  categoryId: 0,
  image: '',
  stock: 0,
};

type FormErrors = Partial<Record<keyof CreateProductPayload, string>>;

export function ProductFormDialog({
  product,
  categories,
  isMutating,
  onSubmit,
  onCancel,
  submitError,
}: ProductFormDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<CreateProductPayload>(
    product ? toPayload(product) : defaultValues,
  );

  function setField<K extends keyof CreateProductPayload>(
    field: K,
    value: CreateProductPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    if (!form.categoryId) nextErrors.categoryId = 'Choose a category.';
    if (!Number.isFinite(form.price) || form.price <= 0)
      nextErrors.price = 'Price must be greater than 0.';
    if (!Number.isInteger(form.stock) || form.stock < 0)
      nextErrors.stock = 'Stock must be 0 or more.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  }

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <h2 id={titleId} className={styles.title}>
        {product ? `Edit ${product.title}` : 'Add product'}
      </h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            className={styles.input}
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            disabled={isMutating}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Category</span>
          <select
            className={styles.input}
            value={form.categoryId}
            onChange={(e) => setField('categoryId', Number(e.target.value))}
            disabled={isMutating}
          >
            <option value={0} disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className={styles.error}>{errors.categoryId}</span>
          )}
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Price</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className={styles.input}
              value={form.price}
              onChange={(e) => setField('price', Number(e.target.value))}
              disabled={isMutating}
            />
            {errors.price && (
              <span className={styles.error}>{errors.price}</span>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Stock</span>
            <input
              type="number"
              min="0"
              className={styles.input}
              value={form.stock}
              onChange={(e) => setField('stock', Number(e.target.value))}
              disabled={isMutating}
            />
            {errors.stock && (
              <span className={styles.error}>{errors.stock}</span>
            )}
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Image URL</span>
          <input
            className={styles.input}
            value={form.image ?? ''}
            onChange={(e) => setField('image', e.target.value || null)}
            disabled={isMutating}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Description</span>
          <textarea
            className={styles.textarea}
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            disabled={isMutating}
            rows={3}
          />
        </label>

        {submitError && <p role="alert">{submitError}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onCancel}
            disabled={isMutating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.confirm}
            disabled={isMutating}
          >
            {isMutating
              ? 'Saving...'
              : product
                ? 'Save changes'
                : 'Add product'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
