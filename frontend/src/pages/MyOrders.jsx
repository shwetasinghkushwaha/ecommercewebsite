import { useEffect, useState } from 'react';
import api from '../services/api.js';
import EmptyState from '../components/EmptyState.jsx';
import Spinner from '../components/Spinner.jsx';

const STATUS_COLORS = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!orders.length)
    return <EmptyState title="No orders yet" subtitle="Place your first order to see it here." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white dark:bg-gray-900 p-5 rounded shadow">
            <div className="flex flex-wrap justify-between gap-2 border-b pb-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{o._id.slice(-10)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Placed on</p>
                <p className="text-sm">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                  {o.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-brand">₹{o.totalAmount}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {o.items.map((it, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <img src={it.image} alt={it.name} className="w-14 h-14 object-cover rounded" />
                  <div className="text-sm">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-gray-500">Qty {it.qty} × ₹{it.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
