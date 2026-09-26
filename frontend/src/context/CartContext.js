import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import * as ordersApi from '../api/ordersApi';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const data = await ordersApi.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  const addToCart = async (productId, quantity) => {
    const updatedCart = await ordersApi.addToCart(productId, quantity);
    setCart(updatedCart);
  };

  const updateCartItem = async (productId, quantity) => {
    const updatedCart = await ordersApi.updateCartItem(productId, quantity);
    setCart(updatedCart);
  };

  const removeFromCart = async (productId) => {
    const updatedCart = await ordersApi.removeFromCart(productId);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart(null);
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartItemCount, loadCart, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
