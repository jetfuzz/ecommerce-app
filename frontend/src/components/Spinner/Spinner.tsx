import { LoaderCircle } from 'lucide-react';
import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div role="status" className={styles.wrapper}>
      <LoaderCircle
        className={styles.spin}
        size={32}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className={styles.hidden}>Loading</span>
    </div>
  );
}
