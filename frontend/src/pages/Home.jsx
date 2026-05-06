import { useEffect, useState } from 'react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 8 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await api.get('/products', { params });
      setProducts(data.items);
      setPages(data.pages);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(['All', ...data]));
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice, sort]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250);
    return () => clearTimeout(t);
  }, [search, category, minPrice, maxPrice, sort, page]);

  const reset = () => {
    setSearch(''); setCategory('All'); setMinPrice(''); setMaxPrice(''); setSort('newest');
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-brand to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold">Shop everything you love</h1>
          <p className="mt-3 text-white/90 max-w-xl">Curated electronics, fashion, home & more — at unbeatable prices.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter bar */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-6 grid gap-3 md:grid-cols-12">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-4 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="md:col-span-2 border rounded-md px-3 py-2">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Min ₹" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} className="md:col-span-1 border rounded-md px-3 py-2" />
          <input type="number" placeholder="Max ₹" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className="md:col-span-1 border rounded-md px-3 py-2" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="md:col-span-3 border rounded-md px-3 py-2">
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button onClick={reset} className="md:col-span-1 border rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Reset</button>
        </div>

        {loading ? (
          <Spinner label="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState title="No products found" subtitle="Try changing your filters." actionTo={null} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            <Pagination page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
