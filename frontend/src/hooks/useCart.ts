import { useEffect, useState } from 'react';
import type { CartState } from '../types';
import {
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../api/cart';
import { useAuth } from '../context/AuthContext';

export function useCart() {
  const { isAuthenticated } = useAuth();
  const [cartState, setState] = useState<CartState>({ status: 'loading' });

  useEffect(() => {
    if (!isAuthenticated) {
      setState({ status: 'idle' });
      return;
    }
    (async () => {
      try {
        setState({ status: 'loading' });
        const cart = await fetchCart();
        setState({ status: 'success', data: cart });
      } catch (err) {
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Something went wrong',
        });
      }
    })();
  }, [isAuthenticated]);

  async function addToCart(productId: number, quantity: number) {
    try {
      const cart = await addCartItem(productId, quantity);
      setState({ status: 'success', data: cart });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }

  async function updateQuantity(itemId: number, quantity: number) {
    try {
      const cart = await updateCartItem(itemId, quantity);
      setState({ status: 'success', data: cart });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }

  async function removeFromCart(itemId: number) {
    try {
      const cart = await removeCartItem(itemId);
      setState({ status: 'success', data: cart });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }

  return { cartState, addToCart, removeFromCart, updateQuantity };
}
