import { Link } from 'react-router';
import styles from '../../styles/statusPage.module.css';

export default function UnauthorizedPage() {
  return (
    <div className={styles.statusPage}>
      <h1 className={styles.heading}>Unauthorized</h1>
      <p className={styles.message}>
        You do not have permission to view this page.
      </p>
      <Link to="/" className={styles.button}>
        Back to home
      </Link>
    </div>
  );
}
