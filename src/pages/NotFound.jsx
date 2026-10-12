import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
    <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
    <p className="text-gray-500">The page you're looking for doesn't exist.</p>
    <Link to="/">
      <Button>Go to Dashboard</Button>
    </Link>
  </div>
);

export default NotFound;
