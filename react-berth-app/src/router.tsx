import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import VesselManagement from './pages/VesselManagement';
import BerthPlanning from './pages/BerthPlanning';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

interface AppRouterProps {
  selectedTerminalId?: string;
}

const AppRouter: React.FC<AppRouterProps> = ({ selectedTerminalId }) => {
  const { state } = useAuth();

  const getBreadcrumbs = (pathname: string) => {
    const breadcrumbMap: Record<string, Array<{title: string; icon?: string}>> = {
      '/dashboard': [{ title: 'Dashboard', icon: '📊' }],
      '/vessels': [{ title: 'Vessel Management', icon: '🚢' }],
      '/vessels/list': [
        { title: 'Vessel Management', icon: '🚢' },
        { title: 'All Vessels' }
      ],
      '/planning': [{ title: 'Berth Planning', icon: '📅' }],
      '/planning/gantt': [
        { title: 'Berth Planning', icon: '📅' },
        { title: 'Timeline View' }
      ],
      '/analytics': [{ title: 'Analytics & Reports', icon: '📈' }],
      '/exports': [{ title: 'Export & Sharing', icon: '📤' }],
      '/profile': [{ title: 'User Profile', icon: '👤' }],
      '/settings': [{ title: 'Account Settings', icon: '⚙️' }],
      '/admin': [{ title: 'Administration', icon: '⚙️' }],
    };

    return breadcrumbMap[pathname] || [];
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route
          path="/login"
          element={!state.isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/signup"
          element={!state.isAuthenticated ? <Signup /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/forgot-password"
          element={!state.isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={state.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout breadcrumbItems={getBreadcrumbs('/dashboard')}>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vessels/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route
                  index
                  element={
                    <MainLayout breadcrumbItems={getBreadcrumbs('/vessels')}>
                      <VesselManagement selectedTerminalId={selectedTerminalId} />
                    </MainLayout>
                  }
                />
                <Route
                  path="list"
                  element={
                    <MainLayout breadcrumbItems={getBreadcrumbs('/vessels/list')}>
                      <VesselManagement selectedTerminalId={selectedTerminalId} />
                    </MainLayout>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/planning/*"
          element={
            <ProtectedRoute requiredRole="planner">
              <Routes>
                <Route
                  index
                  element={
                    <MainLayout breadcrumbItems={getBreadcrumbs('/planning')}>
                      <BerthPlanning selectedTerminalId={selectedTerminalId} />
                    </MainLayout>
                  }
                />
                <Route
                  path="gantt"
                  element={
                    <MainLayout breadcrumbItems={getBreadcrumbs('/planning/gantt')}>
                      <BerthPlanning selectedTerminalId={selectedTerminalId} />
                    </MainLayout>
                  }
                />
                <Route
                  path="conflicts"
                  element={
                    <MainLayout 
                      breadcrumbItems={[
                        { title: 'Berth Planning', icon: '📅' },
                        { title: 'Conflict Resolution' }
                      ]}
                    >
                      <div style={{ padding: 24, textAlign: 'center' }}>
                        <h2>⚠️ Conflict Resolution</h2>
                        <p>This feature will be implemented in a future update.</p>
                      </div>
                    </MainLayout>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route
                  index
                  element={
                    <MainLayout breadcrumbItems={getBreadcrumbs('/analytics')}>
                      <div style={{ padding: 24, textAlign: 'center' }}>
                        <h2>📈 Analytics & Reports</h2>
                        <p>Advanced analytics dashboard coming soon!</p>
                      </div>
                    </MainLayout>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exports/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route
                  index
                  element={
                    <MainLayout breadcrumbItems={getBreadcrumbs('/exports')}>
                      <div style={{ padding: 24, textAlign: 'center' }}>
                        <h2>📤 Export & Sharing</h2>
                        <p>Export functionality will be implemented soon!</p>
                      </div>
                    </MainLayout>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout breadcrumbItems={getBreadcrumbs('/profile')}>
                <UserProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout breadcrumbItems={getBreadcrumbs('/settings')}>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <Routes>
                <Route
                  index
                  element={
                    <MainLayout breadcrumbItems={getBreadcrumbs('/admin')}>
                      <div style={{ padding: 24, textAlign: 'center' }}>
                        <h2>⚙️ Administration</h2>
                        <p>Admin panel features coming in the next release!</p>
                      </div>
                    </MainLayout>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;