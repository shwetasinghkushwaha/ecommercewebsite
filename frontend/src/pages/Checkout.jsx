import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { totalAmount, refresh } = useCart();
  const [form, setForm] = useState({ fullName: '', address: '', city: '', postalCode: '', country: 'India', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: form });
      await refresh();
      toast.success(data.message);
      navigate('/order-success', { state: { order: data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout (Demo)</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow grid sm:grid-cols-2 gap-4">
        {['fullName','phone','address','city','postalCode','country'].map((k) => (
          <input key={k} required placeholder={k.replace(/([A-Z])/g, ' $1').replace(/^./, s=>s.toUpperCase())}
            value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className={`border rounded px-3 py-2 ${k==='address' ? 'sm:col-span-2' : ''}`} />
        ))}
        <div className="sm:col-span-2 border-t pt-4 mt-2 flex justify-between items-center">
          <p className="font-bold text-lg">Total: ₹{totalAmount}</p>
          <button disabled={loading} className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded font-medium disabled:opacity-50">
            {loading ? 'Placing...' : 'Place Order'}
          </button>
        </div>
        <p className="sm:col-span-2 text-xs text-gray-500">No real payment will be processed. This is a demo checkout.</p>
      </form>
    </div>
  );
}
