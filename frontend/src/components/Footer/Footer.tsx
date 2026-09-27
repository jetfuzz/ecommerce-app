import { Link } from 'react-router';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to="/" className={styles.logo}>
        Zenith
      </Link>

      <div className={styles.meta}>
        <a href="https://github.com/jetfuzz" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/jordanrfredericks/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
