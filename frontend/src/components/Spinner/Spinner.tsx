import { LoaderCircle } from "lucide-react";
import styles from './Spinner.module.css';

export default function Spinner() {
    return (
        <span role="status">
            <LoaderCircle className={styles.spin} size={32} aria-hidden="true" />
            <span className={styles.hidden}>Loading</span>
        </span>
    );
}
