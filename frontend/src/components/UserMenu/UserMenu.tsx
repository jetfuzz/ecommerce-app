import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import styles from './UserMenu.module.css';
import { LayoutDashboard, LogOut, Package, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user)
    return (
      <Link to="/login" className={styles.dropdownBtn} aria-label="Sign in">
        <User size={18} strokeWidth={1.5} className={styles.userIcon} />
      </Link>
    );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Account menu" className={styles.dropdownBtn}>
          <User size={18} strokeWidth={1.5} className={styles.userIcon} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.menuContent}
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.Item asChild className={styles.menuItem}>
            <Link to="/orders">
              <Package />
              Orders
            </Link>
          </DropdownMenu.Item>
          {(user.role === 'Admin' || user.role === 'Demo') && (
            <DropdownMenu.Item asChild className={styles.menuItem}>
              <Link to="/admin">
                <LayoutDashboard />
                Admin
              </Link>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            onSelect={handleLogout}
            className={styles.menuItem}
          >
            <LogOut />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
