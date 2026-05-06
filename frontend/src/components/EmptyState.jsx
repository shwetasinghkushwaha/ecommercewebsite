import { Link } from 'react-router-dom';

export default function EmptyState({ title = 'Nothing here yet', subtitle = '', actionTo = '/', actionLabel = 'Continue shopping' }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-3">🛒</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      {actionTo && (
        <Link to={actionTo} className="inline-block mt-5 bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
