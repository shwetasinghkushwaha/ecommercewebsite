import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import Spinner from '../components/Spinner.jsx';

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const EMPTY_FORM = { name:'', description:'', price:'', image:'', category:'', stock: 100 };

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingO, setLoadingO] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoadingP(true);
    api.get('/products', { params: { limit: 50 } })
      .then(({ data }) => setProducts(data.items))
      .finally(() => setLoadingP(false));
  };
  const loadOrders = () => {
    setLoadingO(true);
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoadingO(false));
  };

  useEffect(() => { loadProducts(); loadOrders(); }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      stock: p.stock,
    });
    // scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product added');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Deleted');
    if (editingId === id) resetForm();
    loadProducts();
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Revenue (Demo)</p>
          <p className="text-2xl font-bold text-brand">₹{orders.reduce((s,o)=>s+o.totalAmount,0)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        {['products','orders'].map((t) => (
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 capitalize ${tab===t?'border-b-2 border-brand text-brand font-semibold':'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          <form onSubmit={submit} className="bg-white dark:bg-gray-900 p-6 rounded shadow grid sm:grid-cols-2 gap-3 mb-8">
            <div className="sm:col-span-2 flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:underline">
                  Cancel edit
                </button>
              )}
            </div>
            <input required placeholder="Product Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="border rounded px-3 py-2" />
            <input required placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="border rounded px-3 py-2" />
            <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} className="border rounded px-3 py-2" />
            <input required type="number" placeholder="Stock" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})} className="border rounded px-3 py-2" />
            <input required placeholder="Image URL" value={form.image} onChange={(e)=>setForm({...form,image:e.target.value})} className="border rounded px-3 py-2 sm:col-span-2" />
            {form.image && (
              <img src={form.image} alt="preview" onError={(e)=>{e.target.style.display='none';}} className="sm:col-span-2 w-32 h-32 object-cover rounded border" />
            )}
            <textarea required placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="border rounded px-3 py-2 sm:col-span-2" rows="3" />
            <button disabled={saving} className="sm:col-span-2 bg-brand hover:bg-brand-dark text-white py-2 rounded font-medium disabled:opacity-50">
              {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
            </button>
          </form>

          {loadingP ? <Spinner /> : (
            <div className="bg-white dark:bg-gray-900 rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Category</th>
                    <th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className={`border-t ${editingId===p._id ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                      <td className="p-3"><img src={p.image} alt={p.name} onError={(e)=>{e.target.src='/placeholder.svg';}} className="w-12 h-12 object-cover rounded" /></td>
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3">₹{p.price}</td>
                      <td className="p-3">{p.stock}</td>
                      <td className="p-3 whitespace-nowrap">
                        <button onClick={()=>startEdit(p)} className="text-blue-600 hover:underline mr-3">Edit</button>
                        <button onClick={()=>remove(p._id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'orders' && (
        loadingO ? <Spinner /> : (
          <div className="bg-white dark:bg-gray-900 rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Order</th><th className="p-3">User</th><th className="p-3">Items</th>
                  <th className="p-3">Total</th><th className="p-3">Date</th><th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="p-3 font-mono text-xs">{o._id.slice(-8)}</td>
                    <td className="p-3">{o.user?.name}<br/><span className="text-xs text-gray-500">{o.user?.email}</span></td>
                    <td className="p-3">{o.items.length}</td>
                    <td className="p-3 font-bold text-brand">₹{o.totalAmount}</td>
                    <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <select value={o.status} onChange={(e)=>updateOrderStatus(o._id, e.target.value)} className="border rounded px-2 py-1">
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="6" className="p-6 text-center text-gray-500">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
