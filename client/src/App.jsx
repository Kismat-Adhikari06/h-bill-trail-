import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
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

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute role="admin">
            <DashboardPage />
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
