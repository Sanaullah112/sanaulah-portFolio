import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from './context/AuthContext';
import { ThemeProvider }   from './context/ThemeContext';
import { PortfolioThemeProvider } from './context/PortfolioThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout    from './layouts/AdminLayout';
import AuthLayout     from './layouts/AuthLayout';

import Home              from './pages/Home';
import Login             from './pages/Login';
import Dashboard         from './pages/Dashboard';
import AdminResume       from './pages/AdminResume';
import AdminProject      from './pages/AdminProject';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminLastWork     from './pages/AdminLastWork';
import Settings          from './pages/Settings';
import NotFound          from './pages/NotFound';
import AllProjects from './pages/AllProjects';


function App() {
  return (
    <PortfolioThemeProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public portfolio */}
              <Route path="/" element={<Home />} />
              <Route path="/all-projects" element={<AllProjects />} />

              {/* Authentication */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Admin panel — all nested under /admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index                 element={<Dashboard />} />
                <Route path="resume"         element={<AdminResume />} />
                <Route path="projects"       element={<AdminProject />} />
                <Route path="testimonials"   element={<AdminTestimonials />} />
                <Route path="last-work"      element={<AdminLastWork />} />
                <Route path="settings"       element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </PortfolioThemeProvider>
  );
}

export default App;
