import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/dashboard/teacher/TeacherSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { teacherAPI } from '../../services/api.js';

const QuizzesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, live, draft, graded

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await teacherAPI.getQuizzes();
      setQuizzes(response.data.result.quizzes);
    } catch (error) {
      console.error('Lỗi khi tải quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      graded: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
      live: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
      draft: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return styles[status] || styles.draft;
  };

  const getStatusText = (status) => {
    const text = {
      graded: 'Đã chấm',
      live: 'Đang diễn ra',
      draft: 'Nháp',
    };
    return text[status] || 'Nháp';
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    return quiz.status === filter;
  });

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Bạn có chắc muốn xóa quiz này?')) return;

    try {
      await teacherAPI.deleteQuiz(quizId);
      fetchQuizzes();
    } catch (error) {
      console.error('Lỗi khi xóa quiz:', error);
      alert('Không thể xóa quiz. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex min-h-screen">
        <TeacherSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f] sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Quiz của tôi</h1>
            <Button onClick={() => navigate('/teacher/create-quiz')}>
              Tạo quiz mới
            </Button>
          </header>

          <div className="flex-1 p-10">
            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter('live')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'live'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400'
                }`}
              >
                Đang diễn ra
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'draft'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400'
                }`}
              >
                Nháp
              </button>
              <button
                onClick={() => setFilter('graded')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'graded'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400'
                }`}
              >
                Đã chấm
              </button>
            </div>

            {/* Quizzes Table */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Không có quiz nào
                </p>
                <Button onClick={() => navigate('/teacher/create-quiz')}>
                  Tạo quiz ngay
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18232f] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f6f7f8] dark:bg-[#101922]">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Tên Quiz
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Lớp
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Số câu hỏi
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Ngày hết hạn
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Trạng thái
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((quiz) => (
                        <tr
                          key={quiz.quiz_id}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="p-4 font-medium text-[#111418] dark:text-white">
                            {quiz.title}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {quiz.class_name || '-'}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {quiz.question_count}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {quiz.due_date ? new Date(quiz.due_date).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(quiz.status)}`}>
                              {getStatusText(quiz.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/teacher/quiz/${quiz.id}`)}
                                className="text-primary font-medium text-sm hover:underline"
                              >
                                {quiz.status === 'graded' ? 'Xem kết quả' : 'Chỉnh sửa'}
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz.id)}
                                className="text-red-600 font-medium text-sm hover:underline"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizzesPage;
