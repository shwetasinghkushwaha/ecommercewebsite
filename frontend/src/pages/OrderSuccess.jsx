import { Link, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;
  return (
    <div className="max-w-xl mx-auto text-center py-16 px-4">
      <div className="text-6xl">✅</div>
      <h1 className="text-3xl font-bold mt-4">Order placed successfully (Demo)</h1>
      {order && <p className="text-gray-600 mt-3">Order ID: <span className="font-mono">{order._id}</span></p>}
      {order && <p className="text-lg font-bold mt-1">Total: ₹{order.totalAmount}</p>}
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/" className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded">Continue Shopping</Link>
        <Link to="/my-orders" className="border px-5 py-2 rounded">View Orders</Link>
      </div>
    </div>
  );
}
