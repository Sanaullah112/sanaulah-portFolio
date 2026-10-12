import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-gray-400">…</span>}
          <button
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
