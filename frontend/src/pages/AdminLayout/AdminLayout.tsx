import { Outlet } from 'react-router';
import AdminNav from '../../components/AdminNav/AdminNav';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  return (
    <div className={styles.adminLayout}>
      <AdminNav />
      <div className={styles.adminContent}>
        <Outlet />
      </div>
    </div>
  );
}
