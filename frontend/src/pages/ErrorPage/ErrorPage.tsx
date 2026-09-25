import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Link } from 'react-router';
import styles from '../../styles/statusPage.module.css';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className={styles.statusPage}>
        <h1 className={styles.heading}>
          {error.status} {error.statusText}
        </h1>
        <p className={styles.message}>{error.data}</p>
        <Link to="/" className={styles.button}>
          Back to home
        </Link>
      </div>
    );
  }

  if (error instanceof Error) {
    console.error(error.stack);
    return (
      <div className={styles.statusPage}>
        <h1 className={styles.heading}>Error</h1>
        <p className={styles.message}>{error.message}</p>
        <Link to="/" className={styles.button}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.statusPage}>
      <h1 className={styles.heading}>Unknown Error</h1>
      <Link to="/" className={styles.button}>
        Back to home
      </Link>
    </div>
  );
}
