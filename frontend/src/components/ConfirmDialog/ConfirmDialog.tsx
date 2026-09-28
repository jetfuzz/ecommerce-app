import { useEffect, useId, useRef } from 'react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  title: string;
  description: string;
  isMutating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  isMutating,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p id={descriptionId} className={styles.description}>
        {description}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isMutating}
          className={styles.cancel}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isMutating}
          className={styles.confirm}
        >
          {isMutating ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </dialog>
  );
}
