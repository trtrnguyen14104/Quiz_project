  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import PrivateRoute from './components/PrivateRoute.jsx';

  // Public Pages
  import HomePage from './pages/HomePage.jsx';
  import LoginPage from './pages/LoginPage.jsx';
  import RegisterPage from './pages/RegisterPage.jsx';
  import VerifyEmailPage from './pages/VerifyEmailPage.jsx';

  // Student Pages
  import StudentDashboard from './pages/StudentDashboard.jsx';
  import JoinClassPage from './pages/student/JoinClassPage.jsx';
  import JoinQuizPage from './pages/student/JoinQuizPage.jsx';
  import MyQuizzesPage from './pages/student/MyQuizzesPage.jsx';
  import ResultsPage from './pages/student/ResultsPage.jsx';
  import ClassesPage from './pages/student/ClassesPage.jsx';
  import QuizDescriptionPage from './pages/student/QuizDescriptionPage.jsx';
  import QuizTakingPage from './pages/student/QuizTakingPage.jsx';
  import StudentClassDetailPage from './pages/student/ClassDetailPage.jsx';

  // Teacher Pages
  import TeacherDashboard from './pages/TeacherDashboard.jsx';
  import TeacherClassesPage from './pages/teacher/ClassesPage.jsx';
  import TeacherQuizzesPage from './pages/teacher/QuizzesPage.jsx';
  import ReportsPage from './pages/teacher/ReportsPage.jsx';
  import CreateQuizPage from './pages/teacher/CreateQuizPage.jsx';
  import TeacherClassDetailPage from './pages/teacher/ClassDetailPage.jsx';

  // Admin Pages
  import AdminDashboard from './pages/AdminDashboard.jsx';

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
          <Route
            path="/student/join-class"
            element={
              <PrivateRoute>
                <JoinClassPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/join-quiz"
            element={
              <PrivateRoute>
                <JoinQuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/my-quizzes"
            element={
              <PrivateRoute>
                <MyQuizzesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <PrivateRoute>
                <ResultsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/classes"
            element={
              <PrivateRoute>
                <ClassesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/quiz/:quiz_id"
            element={
              <PrivateRoute>
                <QuizDescriptionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/quiz/:quiz_id/take"
            element={
              <PrivateRoute>
                <QuizTakingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/class/:class_id"
            element={
              <PrivateRoute>
                <StudentClassDetailPage />
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
          <Route
            path="/teacher/classes"
            element={
              <PrivateRoute>
                <TeacherClassesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/quizzes"
            element={
              <PrivateRoute>
                <TeacherQuizzesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/reports"
            element={
              <PrivateRoute>
                <ReportsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/create-quiz"
            element={
              <PrivateRoute>
                <CreateQuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/class/:classId"
            element={
              <PrivateRoute>
                <TeacherClassDetailPage />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  export default App;
