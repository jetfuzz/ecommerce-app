import type { Product } from '../../types';
import table from '../../styles/adminTable.module.css';
import { formatPrice } from '../../utils/formatPrice';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const { isReadOnly } = useAuth();

  return (
    <tr className={table.row}>
      <td className={table.id}>{product.id}</td>
      <td className={table.cell}>
        <img
          src={product.image ?? undefined}
          alt={product.title}
          className={table.thumb}
        />
      </td>
      <td className={table.cell}>{product.title}</td>
      <td className={table.cell}>{product.description}</td>
      <td className={table.cell}>{product.categoryName}</td>
      <td className={table.cell}>{formatPrice(product.price)}</td>
      <td className={table.cell}>{product.stock}</td>
      <td className={table.actions}>
        <button
          type="button"
          className={table.iconButton}
          onClick={() => onEdit(product)}
          aria-label={`Edit ${product.title}`}
          disabled={isReadOnly}
        >
          <Pencil size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={table.iconButton}
          data-variant="danger"
          onClick={() => onDelete(product.id)}
          aria-label={`Delete ${product.title}`}
          disabled={isReadOnly}
        >
          <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
