import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import Spinner from '../components/Spinner.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggle, has } = useWishlist();

  const load = () => api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  useEffect(() => { load(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted');
      setComment(''); setRating(5);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  if (!product) return <Spinner />;
  const wished = has(product._id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full rounded-lg shadow" />
        <div>
          <span className="text-xs uppercase text-gray-500">{product.category}</span>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <p className="text-yellow-500 mt-1">
            ★ {product.rating?.toFixed(1) || '0.0'}{' '}
            <span className="text-gray-500 text-sm">({product.numReviews || 0} reviews)</span>
          </p>
          <p className="text-3xl font-extrabold text-brand mt-4">₹{product.price}</p>
          <p className="mt-4 leading-relaxed">{product.description}</p>
          <p className="text-sm text-gray-500 mt-2">In stock: {product.stock}</p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <label className="text-sm">Qty</label>
            <div className="flex items-center border rounded">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1">−</button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-1">+</button>
            </div>
            <button onClick={() => addToCart(product._id, qty)} className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded font-medium">
              Add to Cart
            </button>
            <button onClick={() => toggle(product._id)} className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              {wished ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {product.reviews?.length === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
        <div className="space-y-3">
          {product.reviews?.map((r) => (
            <div key={r._id} className="bg-white dark:bg-gray-900 p-4 rounded shadow">
              <div className="flex justify-between">
                <p className="font-medium">{r.name}</p>
                <p className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
              </div>
              <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
              <p className="mt-2">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={submitReview} className="bg-white dark:bg-gray-900 p-5 rounded shadow mt-6">
            <h3 className="font-semibold mb-3">Write a review</h3>
            <label className="block text-sm mb-1">Rating</label>
            <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="border rounded px-3 py-2 mb-3">
              {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
            <textarea required value={comment} onChange={(e)=>setComment(e.target.value)} rows="3" placeholder="Share your experience..." className="w-full border rounded px-3 py-2" />
            <button disabled={submitting} className="mt-3 bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="mt-6 text-gray-500">Login to write a review.</p>
        )}
      </section>
    </div>
  );
}
