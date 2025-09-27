// client/src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { initializeAuth } from "./store/slices/authSlice";
import { Loader2 } from "lucide-react";

// Layout Components
import DashboardLayout from "./components/layout/DashboardLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import HealthRecords from "./pages/HealthRecords/HealthRecords";
import CreateRecord from "./pages/HealthRecords/CreateRecord";
import RecordDetail from "./pages/HealthRecords/RecordDetail";
import AIInsights from "./pages/AIInsights/AIInsights";
import Reminders from "./pages/Reminders/Reminders";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state on app load
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading HealthMitra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="health-records" element={<HealthRecords />} />
          <Route path="health-records/new" element={<CreateRecord />} />
          <Route path="health-records/:id" element={<RecordDetail />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Default Redirects */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/auth/login"}
              replace
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
