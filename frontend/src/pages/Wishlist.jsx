import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Wishlist() {
  const { items, loading, remove } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <Spinner />;
  if (!items.length)
    return <EmptyState title="Your wishlist is empty" subtitle="Tap the heart on products you love." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p._id} className="bg-white dark:bg-gray-900 rounded shadow p-4 flex gap-4">
            <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <Link to={`/product/${p._id}`} className="font-semibold hover:text-brand">{p.name}</Link>
              <p className="text-brand font-bold mt-1">₹{p.price}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => addToCart(p._id, 1)} className="bg-brand hover:bg-brand-dark text-white px-3 py-1 rounded text-sm">Add to Cart</button>
                <button onClick={() => remove(p._id)} className="border px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
