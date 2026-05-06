import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [user]);

  const addToCart = async (productId, qty = 1) => {
    if (!user) { toast.error('Please login first'); return; }
    const { data } = await api.post('/cart', { productId, qty });
    setCart(data);
    toast.success('Added to cart');
  };

  const updateQty = async (productId, qty) => {
    const { data } = await api.put(`/cart/${productId}`, { qty });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
    toast.success('Removed from cart');
  };

  const clear = async () => {
    await api.delete('/cart');
    setCart({ items: [] });
  };

  const totalItems = cart.items?.reduce((s, i) => s + i.qty, 0) || 0;
  const totalAmount = cart.items?.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQty, removeItem, clear, refresh, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
