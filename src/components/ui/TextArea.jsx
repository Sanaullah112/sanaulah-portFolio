const TextArea = ({ label, error, rows = 4, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full rounded-xl border bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none ${
          error ? 'border-red-400' : 'border-gray-300 dark:border-gray-700'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default TextArea;
