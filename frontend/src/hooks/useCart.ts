import { useEffect, useState } from 'react';
import type { CartState } from '../types';
import {
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

export function useCart() {
  const { isAuthenticated } = useAuth();
  const [isMutating, setIsMutating] = useState(false);
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
          message: getErrorMessage(err),
        });
      }
    })();
  }, [isAuthenticated]);

  async function addToCart(productId: number, quantity: number) {
    setIsMutating(true);
    try {
      const cart = await addCartItem(productId, quantity);
      setState({ status: 'success', data: cart });
    } catch (err) {
      setState({
        status: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function updateQuantity(itemId: number, quantity: number) {
    setIsMutating(true);
    try {
      const cart = await updateCartItem(itemId, quantity);
      setState({ status: 'success', data: cart });
    } catch (err) {
      setState({
        status: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function removeFromCart(itemId: number) {
    setIsMutating(true);
    try {
      const cart = await removeCartItem(itemId);
      setState({ status: 'success', data: cart });
    } catch (err) {
      setState({
        status: 'error',
        message: getErrorMessage(err),
      });
    } finally {
      setIsMutating(false);
    }
  }

  return { cartState, isMutating, addToCart, removeFromCart, updateQuantity };
}
