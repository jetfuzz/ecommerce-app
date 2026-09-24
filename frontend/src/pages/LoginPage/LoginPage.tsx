import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import type { LoginResponse } from '../../types';
import axios from 'axios';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<LoginResponse>('/api/auth/login', {
        email,
        password,
      });
      login(res.data.token, res.data.user);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.heading}>Log in</h1>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        <p className={styles.footNote}>
          New Customer? <Link to="/register">Create an Account</Link>
        </p>
      </form>
    </div>
  );
}