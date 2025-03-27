import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from '../../context/SidebarContext';

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 