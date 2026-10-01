import { useState } from 'react';
import table from '../../styles/adminTable.module.css';
import styles from '../../styles/categoryRow.module.css';
import { Check, X } from 'lucide-react';

interface NewCategoryRowProps {
  isMutating: boolean;
  onCreate: (name: string) => Promise<void>;
  onClose: () => void;
}

export function NewCategoryRow({
  isMutating,
  onCreate,
  onClose,
}: NewCategoryRowProps) {
  const [draft, setDraft] = useState('');

  async function save() {
    const name = draft.trim();
    if (!name) {
      onClose();
      return;
    }
    try {
      await onCreate(name);
      onClose();
    } catch {}
  }

  return (
    <tr className={table.row}>
      <td className={table.id}></td>
      <td className={table.cell}>
        <input
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="New category name"
          disabled={isMutating}
          autoFocus
        />
      </td>
      <td className={table.actions}>
        <button
          type="button"
          className={table.iconButton}
          onClick={save}
          disabled={isMutating}
          aria-label="Create category"
        >
          <Check size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={table.iconButton}
          onClick={onClose}
          disabled={isMutating}
          aria-label="Cancel"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
