import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) { setItems([]); return; }
    try {
      setLoading(true);
      const { data } = await api.get('/wishlist');
      setItems(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [user]);

  const toggle = async (productId) => {
    if (!user) { toast.error('Please login first'); return; }
    const { data } = await api.post('/wishlist/toggle', { productId });
    toast.success(data.added ? 'Added to wishlist' : 'Removed from wishlist');
    refresh();
    return data.added;
  };

  const remove = async (productId) => {
    await api.delete(`/wishlist/${productId}`);
    toast.success('Removed from wishlist');
    refresh();
  };

  const has = (productId) => items.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ items, loading, toggle, remove, has, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
