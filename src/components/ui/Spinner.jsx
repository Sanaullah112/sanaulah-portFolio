const Spinner = ({ size = 16, className = '' }) => (
  <div
    className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    style={{ width: size, height: size }}
  />
);

export default Spinner;
