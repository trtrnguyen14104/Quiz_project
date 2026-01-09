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
  import QuizLibraryPage from './pages/student/QuizLibraryPage.jsx';
  import ResultsPage from './pages/student/ResultsPage.jsx';
  import ClassesPage from './pages/student/ClassesPage.jsx';
  import QuizDescriptionPage from './pages/student/QuizDescriptionPage.jsx';
  import QuizTakingPage from './pages/student/QuizTakingPage.jsx';
  import QuizResultPage from './pages/student/QuizResultPage.jsx';
  import StudentClassDetailPage from './pages/student/ClassDetailPage.jsx';
  import StudentCreateQuizPage from './pages/student/CreateQuizPage.jsx';
  import StudentEditQuizPage from './pages/student/EditQuizPage.jsx';

  // Teacher Pages
  import TeacherDashboard from './pages/TeacherDashboard.jsx';
  import TeacherClassesPage from './pages/teacher/ClassesPage.jsx';
  import TeacherQuizzesPage from './pages/teacher/QuizzesPage.jsx';
  import ReportsPage from './pages/teacher/ReportsPage.jsx';
  import TeacherCreateQuizPage from './pages/teacher/CreateQuizPage.jsx';
  import TeacherEditQuizPage from './pages/teacher/EditQuizPage.jsx';
  import TeacherQuizDescriptionPage from './pages/teacher/QuizDescriptionPage.jsx';
  import TeacherClassDetailPage from './pages/teacher/ClassDetailPage.jsx';

  // Admin Pages
  import AdminDashboard from './pages/AdminDashboard.jsx';
  import AdminUsersPage from './pages/admin/UsersPage.jsx';
  import AddUserPage from './pages/admin/AddUserPage.jsx';
  import AdminQuizzesPage from './pages/admin/QuizzesPage.jsx';
  import AdminClassesPage from './pages/admin/ClassesPage.jsx';

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
            path="/student/quiz-library"
            element={
              <PrivateRoute>
                <QuizLibraryPage />
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
            path="/student/result/:attempt_id"
            element={
              <PrivateRoute>
                <QuizResultPage />
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
          <Route
            path="/student/create-quiz"
            element={
              <PrivateRoute>
                <StudentCreateQuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/quiz/:quiz_id/edit"
            element={
              <PrivateRoute>
                <StudentEditQuizPage />
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
                <TeacherCreateQuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/quiz/:quiz_id"
            element={
              <PrivateRoute>
                <TeacherQuizDescriptionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/quiz/:quiz_id/edit"
            element={
              <PrivateRoute>
                <TeacherEditQuizPage />
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
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <AdminUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <PrivateRoute>
                <AddUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/quizzes"
            element={
              <PrivateRoute>
                <AdminQuizzesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <PrivateRoute>
                <AdminClassesPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  export default App;
