import { useAuth } from '../../context/AuthContext';
import styles from './DemoBanner.module.css';

export default function DemoBanner() {
  const { isReadOnly } = useAuth();
  if (!isReadOnly) return null;

  return (
    <div className={styles.banner}>
      Demo account. Admin pages are view-only.
    </div>
  );
}
