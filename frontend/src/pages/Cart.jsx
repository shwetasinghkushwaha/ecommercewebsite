import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

export default function Cart() {
  const { cart, updateQty, removeItem, totalAmount, totalItems } = useCart();
  const navigate = useNavigate();

  if (!cart.items?.length)
    return <EmptyState title="Your cart is empty" subtitle="Add some products to get started." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <div key={item.product._id} className="bg-white dark:bg-gray-900 p-4 rounded shadow flex flex-col sm:flex-row gap-4">
            <img src={item.product.image} alt={item.product.name} className="w-full sm:w-28 h-28 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-brand font-bold mt-1">₹{item.product.price}</p>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => updateQty(item.product._id, item.qty - 1)} className="px-3 py-1 border rounded">−</button>
                <span className="w-8 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.product._id, item.qty + 1)} className="px-3 py-1 border rounded">+</button>
                <button onClick={() => removeItem(item.product._id)} className="ml-4 text-red-600 text-sm hover:underline">Remove</button>
              </div>
            </div>
            <p className="font-bold sm:text-right">₹{item.product.price * item.qty}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow h-fit">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between text-sm mb-2"><span>Items</span><span>{totalItems}</span></div>
        <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>₹{totalAmount}</span></div>
        <div className="flex justify-between text-sm mb-2"><span>Shipping</span><span className="text-green-600">FREE</span></div>
        <div className="flex justify-between font-bold text-lg border-t pt-3"><span>Total</span><span>₹{totalAmount}</span></div>
        <button onClick={() => navigate('/checkout')} className="w-full mt-5 bg-brand hover:bg-brand-dark text-white py-2.5 rounded font-medium">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
