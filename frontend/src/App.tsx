import { Outlet } from 'react-router';
import Header from './components/Header/Header';
import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCartContext } from './context/CartContext';

function App() {
  const productState = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cartState } = useCartContext();

  const cartItemCount =
    cartState.status === 'success' ? cartState.data.totalItemCount : 0;

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemCount={cartItemCount}
      />
      {productState.status === 'loading' && <p>Loading...</p>}
      {productState.status === 'error' && <p>{productState.message}</p>}
      {productState.status === 'success' && (
        <Outlet
          context={{
            products: productState.data,
            searchQuery,
          }}
        />
      )}
    </>
  );
}

export default App;
