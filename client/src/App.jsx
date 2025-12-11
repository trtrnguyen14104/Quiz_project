  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import PrivateRoute from './components/PrivateRoute.jsx';

  // Pages
  import HomePage from './pages/HomePage.jsx';
  import LoginPage from './pages/LoginPage.jsx';
  import RegisterPage from './pages/RegisterPage.jsx';
  import StudentDashboard from './pages/StudentDashboard.jsx';
  import TeacherDashboard from './pages/TeacherDashboard.jsx';
  import AdminDashboard from './pages/AdminDashboard.jsx';
  import VerifyEmailPage from './pages/VerifyEmailPage.jsx';

  function App() {
    return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  export default App;
