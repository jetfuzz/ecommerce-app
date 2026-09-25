import { Outlet } from 'react-router';
import Header from './components/Header/Header';
import { useEffect, useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCartContext } from './context/CartContext';
import Spinner from './components/Spinner/Spinner';
import Footer from './components/Footer/Footer';
import styles from './styles/statusPage.module.css';

function App() {
  const productState = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cartState } = useCartContext();
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (productState.status !== 'loading') {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), 3000);
    return () => clearTimeout(timer);
  }, [productState.status]);

  const cartItemCount =
    cartState.status === 'success' ? cartState.data.totalItemCount : 0;

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemCount={cartItemCount}
      />
      {productState.status === 'loading' && (
        <div role="status" className={styles.statusPage}>
          <Spinner />
          {isSlow && (
            <p className={styles.statusMessage}>
              Waking up the server, this can take up to a minute
            </p>
          )}
        </div>
      )}
      {productState.status === 'error' && (
        <div className={styles.statusPage}>
          <p className={styles.errorMessage}>{productState.message}</p>
        </div>
      )}
      {productState.status === 'success' && (
        <Outlet
          context={{
            products: productState.data,
            searchQuery,
          }}
        />
      )}
      <Footer />
    </>
  );
}

export default App;
