import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <Outlet />
    <Toaster position="top-right" />
  </div>
);

export default AuthLayout;
