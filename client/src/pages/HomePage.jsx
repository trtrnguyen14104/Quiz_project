import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import api from '../services/api.js';
import QuizCard from '../components/quiz/QuizCard.jsx';

export default function HomePage() {
  const user = authService.getUser();
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicQuizzes();
  }, []);

  const fetchPublicQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quizzes', {
        params: {
          page: 1,
          limit: 6,
          status: 'published',
        },
      });

      if (response.data.wasSuccessful) {
        setPublicQuizzes(response.data.result.quizzes || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">QuizLearn</h1>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600 dark:text-gray-300">Chào mừng, {user.user_name || user.name}</span>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Trang chính
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Chào mừng bạn đến với Quizlearn
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Tạo, chia sẻ và học hỏi qua các bài quiz tương tác
          </p>

          {!user && (
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Bắt đầu ngay
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 text-lg font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                Đang nhập
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Tạo bài Quiz</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Dễ dàng tạo các bài quiz tương tác với nhiều loại câu hỏi khác nhau.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Quản lý lớp học</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tổ chức và quản lý các lớp học của bạn một cách hiệu quả.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Theo dõi tiến trình</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Theo dõi hiệu suất và tiến trình học tập của học sinh qua các báo cáo chi tiết.
            </p>
          </div>
        </div>

        {/* Public Quizzes Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Quiz phổ biến</h2>
            {user && (
              <Link
                to={`/${user.role}/quiz-library`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                Xem tất cả →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : publicQuizzes.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Chưa có quiz công khai nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.quiz_id}
                  quiz={quiz}
                  variant="standard"
                  onClick={() => {
                    if (user) {
                      window.location.href = `/${user.role}/quiz/${quiz.quiz_id}`;
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                />
              ))}
            </div>
          )}

          {!user && publicQuizzes.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Đăng nhập để làm quiz và theo dõi kết quả của bạn
              </p>
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
