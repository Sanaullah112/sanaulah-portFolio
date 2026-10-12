import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = () => {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-blue-600 flex items-center">
        <FiHome size={14} />
      </Link>
      {parts.map((part, idx) => {
        const path = '/' + parts.slice(0, idx + 1).join('/');
        const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        return (
          <span key={path} className="flex items-center gap-1.5">
            <FiChevronRight size={12} />
            <Link to={path} className="hover:text-blue-600 capitalize">
              {label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
