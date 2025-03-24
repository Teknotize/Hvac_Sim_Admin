import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/crm/Contacts';
import MainLayout from './components/layout/MainLayout';
import Logout from './pages/Logout';
// Protected route component
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
          <Route path="distributors" element={<div className="p-4">Distributors Page (Coming Soon)</div>} />
          <Route path="crm/contacts" element={<Contacts />} />
          <Route path="crm/pdf-manual" element={<div className="p-4">PDF Manual Page (Coming Soon)</div>} />
          <Route path="cms" element={<div className="p-4">CMS Page (Coming Soon)</div>} />
          <Route path="logout" element={<Logout />} />
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
