import { Link } from 'react-router-dom';
import { authService } from '../services/authService.js';

export default function HomePage() {
  const user = authService.getUser();
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz App</h1>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600">Welcome, {user.user_name || user.name}</span>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to Quiz Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create, share, and take quizzes with ease. Perfect for teachers and students.
          </p>

          {!user && (
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">=�</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Create Quizzes</h3>
            <p className="text-gray-600">
              Easily create custom quizzes with multiple question types and settings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">=e</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Classes</h3>
            <p className="text-gray-600">
              Organize students into classes and assign quizzes efficiently.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">=�</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor student performance with detailed analytics and reports.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
