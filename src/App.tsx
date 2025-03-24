import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/layout/MainLayout';
import Toast from './components/toast';
import useTokenRefresh from './utils/refreshTokenTimer';
import NotFoundPage from './pages/notFound';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken); 

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  useTokenRefresh(); 

  return <>{children}</>;
};
function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes with layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<div className="p-4">Reports Page (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
        </Route>
        <Route path="not-found" element={<NotFoundPage/>} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
    <Toast/>
    </>
  );
}

export default App;
