import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.tsx";
import { ReactNode } from "react";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { useAuth } from "./hooks/useAuth.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import UserForm from "./components/UserForm.tsx";
import RolesPage from "./pages/RolesPage.tsx";
import LoadingSpinner from "./components/LoadingSpinner";
import { motion } from 'framer-motion';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center min-h-screen"
        >
          <LoadingSpinner />
        </motion.div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/roles" element={<RolesPage />} />
            </Route>
            <Route
              path="register-user-admin"
              element={<UserForm showSelectRole={true} />}
            />
            <Route
              path="edit-user/:id"
              element={<UserForm showSelectRole={true} />}
            />
            <Route
              path="register-user"
              element={<UserForm showSelectRole={false} />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
