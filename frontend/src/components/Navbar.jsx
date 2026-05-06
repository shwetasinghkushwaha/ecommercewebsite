import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wish } = useWishlist();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand' : 'text-gray-700 dark:text-gray-300 hover:text-brand'}`;

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-extrabold text-brand">
          SAM<span className="text-gray-900 dark:text-gray-100">shop</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkCls}>Home</NavLink>
          {user && <NavLink to="/wishlist" className={linkCls}>
            Wishlist {wish.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{wish.length}</span>}
          </NavLink>}
          {user && <NavLink to="/my-orders" className={linkCls}>My Orders</NavLink>}
          {user?.isAdmin && <NavLink to="/admin" className={linkCls}>Admin</NavLink>}
          <NavLink to="/cart" className={linkCls}>
            Cart {totalItems > 0 && <span className="ml-1 bg-brand text-white text-xs rounded-full px-2 py-0.5">{totalItems}</span>}
          </NavLink>

          <button onClick={toggle} className="px-2 py-1 rounded text-lg" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded-md text-sm">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkCls}>Login</NavLink>
              <Link to="/register" className="bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded-md text-sm">Sign Up</Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="px-2 py-1 text-lg">{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button className="p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 px-4 py-3 space-y-2">
          <NavLink to="/" onClick={() => setOpen(false)} className="block py-2">Home</NavLink>
          <NavLink to="/cart" onClick={() => setOpen(false)} className="block py-2">Cart ({totalItems})</NavLink>
          {user && <NavLink to="/wishlist" onClick={() => setOpen(false)} className="block py-2">Wishlist ({wish.length})</NavLink>}
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className="block py-2">My Orders</NavLink>}
          {user?.isAdmin && <NavLink to="/admin" onClick={() => setOpen(false)} className="block py-2">Admin</NavLink>}
          {user ? (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full bg-brand text-white py-2 rounded">Logout</button>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)} className="block py-2">Login</NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)} className="block py-2">Sign Up</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
