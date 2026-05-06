import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Navbar from "./components/Shared/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import OfficerDashboard from "./pages/Officer/OfficerDashboard";
import TrackComplaint from "./pages/TrackComplaint";
import { LoadingSpinner } from "./components/Shared";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "OFFICER") return <Navigate to="/officer/dashboard" replace />;
  return <Navigate to="/citizen/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Citizen */}
          <Route path="/citizen/dashboard" element={
            <ProtectedRoute allowedRoles={["CITIZEN"]}>
              <Layout><CitizenDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Officer */}
          <Route path="/officer/dashboard" element={
            <ProtectedRoute allowedRoles={["OFFICER"]}>
              <Layout><OfficerDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
