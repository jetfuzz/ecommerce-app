import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import type { Category } from '../../types';
import table from '../../styles/adminTable.module.css';
import styles from './CategoryRow.module.css';

interface CategoryRowProps {
  category: Category;
  isMutating: boolean;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => void;
}

export function CategoryRow({
  category,
  isMutating,
  onUpdate,
  onDelete,
}: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');

  function startEditing() {
    setDraft(category.name);
    setIsEditing(true);
  }

  async function save() {
    const name = draft.trim();

    if (!name || name === category.name) {
      setIsEditing(false);
      return;
    }

    try {
      await onUpdate(category.id, name);
      setIsEditing(false);
    } catch {
      // page handles message, left in edit mode to keep draft
    }
  }

  if (isEditing) {
    return (
      <tr className={table.row}>
        <td className={table.id}>{category.id}</td>
        <td className={table.cell}>
          <input
            className={styles.input}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Category name"
            disabled={isMutating}
          />
        </td>
        <td className={table.actions}>
          <button
            type="button"
            className={table.iconButton}
            onClick={save}
            disabled={isMutating}
            aria-label="Save changes"
          >
            <Check size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={table.iconButton}
            onClick={() => setIsEditing(false)}
            disabled={isMutating}
            aria-label="Cancel editing"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className={table.row}>
      <td className={table.id}>{category.id}</td>
      <td className={table.cell}>{category.name}</td>
      <td className={table.actions}>
        <button
          type="button"
          className={table.iconButton}
          onClick={startEditing}
          aria-label={`Edit ${category.name}`}
        >
          <Pencil size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={table.iconButton}
          data-variant="danger"
          onClick={() => onDelete(category.id)}
          aria-label={`Delete ${category.name}`}
        >
          <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
