import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Contacts from "./pages/crm/Contacts";
import PdfManual from "./pages/crm/PdfManual";
import Cms from "./pages/cms/Cms";
import MainLayout from "./components/layout/MainLayout";
import DistributorTable from "./components/distributor/distributorTable";
import Toast from "./components/toast/loginToast";
import useTokenRefresh from "./utils/refreshTokenTimer";
import NotFoundPage from "./pages/notFound";
import { useAuthStore } from "./store/useAuthStore";
import AppData from "./pages/AppData";
import ProgressToast from "./components/toast/sendingEmailToast";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  useTokenRefresh();

  return <>{children}</>;
}

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
            <Route path="distributors" element={<DistributorTable />} />
            <Route path="app-data" element={<AppData />} />
            <Route path="crm/contacts" element={<Contacts />} />
            <Route path="crm/pdf-manual" element={<PdfManual />} />
            <Route path="cms" element={<Cms />} />
          </Route>
          <Route path="not-found" element={<NotFoundPage />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
      <ProgressToast />
      <Toast />
    </>
  );
}

export default App;
