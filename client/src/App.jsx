import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateBillPage from "./pages/CreateBillPage";
import EditBillPage from "./pages/EditBillPage";
import QRPage from "./pages/QRPage";
import BillPage from "./pages/BillPage";
import UserPage from "./pages/UserPage";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/" : "/dashboard"} />;
  }

  return children;
}

function AppRoutes({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute role="admin">
            <DashboardPage onMenuClick={onMenuClick} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bill/new"
        element={
          <ProtectedRoute role="admin">
            <CreateBillPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bill/:id/edit"
        element={
          <ProtectedRoute role="admin">
            <EditBillPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr/:id"
        element={
          <ProtectedRoute role="admin">
            <QRPage />
          </ProtectedRoute>
        }
      />
      <Route path="/bill/:id" element={<BillPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? (user.role === "admin" ? "/" : "/dashboard") : "/login"} />} />
    </Routes>
  );
}

function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSidebar = user && user.role;

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          {showSidebar && (
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          )}
          <div className="app-main">
            {showSidebar && (
              <button className="hamburger" onClick={() => setSidebarOpen(true)}>
                &#9776;
              </button>
            )}
            <div className="app-container">
              <AppRoutes onMenuClick={() => setSidebarOpen(true)} />
            </div>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
