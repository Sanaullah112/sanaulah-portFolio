import { Outlet } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SidebarProvider } from '../context/SidebarContext';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  const contentRef = useRef(null);

  useGSAP(() => {
    gsap.from(contentRef.current, { opacity: 0, y: 8, duration: 0.25, ease: 'power2.out' });
  }, { scope: contentRef });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1600px] w-full mx-auto">
            <div className="mb-4">
              <Breadcrumb />
            </div>
            <div ref={contentRef}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </SidebarProvider>
  );
};

export default AdminLayout;
