const TableSkeleton = ({ rows = 6, columns = 5 }) => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
    <div className="bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
      <div className="skeleton h-4 w-1/3" />
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        className="flex gap-4 px-4 py-3 border-t border-gray-100 dark:border-gray-800"
      >
        {Array.from({ length: columns }).map((__, c) => (
          <div key={c} className="skeleton h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
