export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 border rounded disabled:opacity-40"
      >
        Prev
      </button>
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`px-3 py-1.5 border rounded ${
            n === page ? 'bg-brand text-white border-brand' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1.5 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
