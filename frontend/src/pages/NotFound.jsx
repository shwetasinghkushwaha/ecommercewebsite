import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <p className="mt-3 text-gray-600">Page not found</p>
      <Link to="/" className="inline-block mt-5 bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded">Go Home</Link>
    </div>
  );
}
