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
            <h1 className="text-2xl font-bold text-gray-800">QuizLearn</h1>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600">Chào mừng, {user.user_name || user.name}</span>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Trang chính
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700">
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
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Chào mừng bạn đến với Quizlearn
          </h2>
          <p className="text-xl text-gray-600 mb-8">
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
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Đang nhập
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tạo bài Quiz</h3>
            <p className="text-gray-600">
              Dễ dàng tạo các bài quiz tương tác với nhiều loại câu hỏi khác nhau.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quản lý lớp học</h3>
            <p className="text-gray-600">
              Tổ chức và quản lý các lớp học của bạn một cách hiệu quả.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Theo dõi tiến trình</h3>
            <p className="text-gray-600">
              Theo dõi hiệu suất và tiến trình học tập của học sinh qua các báo cáo chi tiết.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
