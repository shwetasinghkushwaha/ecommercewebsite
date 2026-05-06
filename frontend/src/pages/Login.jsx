import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" required placeholder="Email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input type="password" required placeholder="Password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <button disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded font-medium disabled:opacity-50">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          New here? <Link to="/register" className="text-brand font-medium">Create an account</Link>
        </p>
        <p className="text-xs text-gray-400 mt-3 text-center">Admin demo: admin@shop.com / admin123</p>
      </div>
    </div>
  );
}
