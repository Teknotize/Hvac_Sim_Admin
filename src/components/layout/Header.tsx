import { useNavigate } from 'react-router-dom';
import useLogout from '../logout';
import Toast from '../toast';
import { useState } from 'react';
export default function Header() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const logout = useLogout(setToast);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    logout()
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="flex items-center">
        <div className="relative ml-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Admin User</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </header>
  );
} 