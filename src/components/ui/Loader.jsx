const Loader = ({ fullScreen = false, size = 32 }) => {
  const spinner = (
    <div
      className="animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-600"
      style={{ width: size, height: size }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default Loader;
