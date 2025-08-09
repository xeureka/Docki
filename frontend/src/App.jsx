import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import AdminPage from "./pages/AdminPage";
import { useMemo } from "react";

function PrivateRoute({ children }) {
  const isAuthenticated = useMemo(() => {
    return !!localStorage.getItem("token");
  }, []);

  return isAuthenticated ? children : <Navigate to="/" />;
}

function AdminRoute({ children }) {
  const isAuthenticated = useMemo(() => {
    return !!localStorage.getItem("token");
  }, []);

  const user = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(atob(token.split('.')[1])) : null; 
  }, []);

  const isAdmin = user && user.role === "admin"; 

  return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Login is the default route */}
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
