import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import EmployeeDashboard from './pages/Employee/Dashboard';
import ApplyLeave from './pages/Employee/ApplyLeave';
import MyLeaves from './pages/Employee/MyLeaves';
import ManagerDashboard from './pages/Manager/Dashboard';
import AddEmployee from './pages/Manager/AddEmployee';
import Analytics from './pages/Manager/Analytics';

// Protect Routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'Manager' ? '/manager' : '/'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Employee Routes */}
          <Route index element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="apply" element={<ProtectedRoute allowedRoles={['Employee']}><ApplyLeave /></ProtectedRoute>} />
          <Route path="history" element={<ProtectedRoute allowedRoles={['Employee']}><MyLeaves /></ProtectedRoute>} />

          {/* Manager Routes */}
          <Route path="manager" element={<ProtectedRoute allowedRoles={['Manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="manager/add-employee" element={<ProtectedRoute allowedRoles={['Manager']}><AddEmployee /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute allowedRoles={['Manager']}><Analytics /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
