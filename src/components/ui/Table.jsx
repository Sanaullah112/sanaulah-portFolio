import EmptyState from './EmptyState';
import TableSkeleton from './TableSkeleton';

/**
 * Generic reusable table.
 * columns: [{ key, header, render?(row) }]
 */
const Table = ({ columns, data = [], loading = false, emptyMessage = 'No records found' }) => {
  if (loading) return <TableSkeleton columns={columns.length} />;
  if (!data.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto scrollbar-thin rounded-2xl border border-gray-100 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-gray-500 dark:text-gray-400">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row._id || row.id || idx}
              className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
