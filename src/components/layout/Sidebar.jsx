import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiFileText, FiFolder, FiMessageSquare, FiBriefcase,
  FiSettings, FiLogOut, FiX,
} from 'react-icons/fi';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/resume', label: 'Resume', icon: FiFileText },
  { to: '/admin/projects', label: 'Projects', icon: FiFolder },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { to: '/admin/last-work', label: 'Last Work', icon: FiBriefcase },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

const SidebarContent = ({ onNavigate }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 shadow-xl lg:hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiX size={18} />
              </button>
              <SidebarContent onNavigate={() => setIsOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
