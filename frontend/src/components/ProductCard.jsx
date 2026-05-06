import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggle, has } = useWishlist();
  const wished = has(product._id);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col relative">
      <button
        onClick={() => toggle(product._id)}
        className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded-full w-9 h-9 flex items-center justify-center shadow hover:scale-110 transition"
        aria-label="Toggle wishlist"
      >
        <span className={wished ? 'text-red-500' : 'text-gray-400'}>
          {wished ? '❤️' : '🤍'}
        </span>
      </button>
      <Link to={`/product/${product._id}`} className="block">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" loading="lazy" />
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs text-gray-500 uppercase">{product.category}</span>
        <Link to={`/product/${product._id}`} className="font-semibold mt-1 line-clamp-2 hover:text-brand">
          {product.name}
        </Link>
        <p className="text-yellow-500 text-sm mt-1">
          ★ {product.rating?.toFixed(1) || '0.0'}{' '}
          <span className="text-gray-400">({product.numReviews || 0})</span>
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold">₹{product.price}</span>
          <button onClick={() => addToCart(product._id, 1)} className="bg-brand hover:bg-brand-dark text-white text-sm px-3 py-1.5 rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
