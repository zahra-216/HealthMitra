// client/src/App.jsx
const React = require("react");
const { useEffect } = require("react");
const { Routes, Route, Navigate } = require("react-router-dom");
const { useAppDispatch, useAppSelector } = require("./hooks/redux");
const { fetchProfile } = require("./store/slices/authSlice");
const { Loader2 } = require("lucide-react");

// Layout Components
const DashboardLayout = require("./components/layout/DashboardLayout");
const AuthLayout = require("./components/layout/AuthLayout");

// Pages
const Login = require("./pages/Auth/Login");
const Register = require("./pages/Auth/Register");
const Dashboard = require("./pages/Dashboard/Dashboard");
const HealthRecords = require("./pages/HealthRecords/HealthRecords");
const CreateRecord = require("./pages/HealthRecords/CreateRecord");
const RecordDetail = require("./pages/HealthRecords/RecordDetail");
const AIInsights = require("./pages/AIInsights/AIInsights");
const Reminders = require("./pages/Reminders/Reminders");
const Profile = require("./pages/Profile/Profile");
const NotFound = require("./pages/NotFound");

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Fetch user profile on app load if authenticated
    if (isAuthenticated) {
      dispatch(fetchProfile())
        .unwrap()
        .catch(() => {
          // Token invalid/expired → clear token & redirect
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
        });
    }
  }, [dispatch, isAuthenticated]);

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
}

module.exports = App;
