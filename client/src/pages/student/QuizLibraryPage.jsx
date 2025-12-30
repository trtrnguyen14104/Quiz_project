import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api.js';

const QuizLibraryPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    subject_id: '',
    difficulty_level: '',
  });
  const [subjects, setSubjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });

  useEffect(() => {
    fetchSubjects();
    fetchQuizzes();
  }, [pagination.page, filters]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      if (response.data.wasSuccessful) {
        setSubjects(response.data.result);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách môn học:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quizzes', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          status: 'published',
          ...filters,
        },
      });

      if (response.data.wasSuccessful) {
        setQuizzes(response.data.result.quizzes);
        setPagination((prev) => ({
          ...prev,
          total: response.data.result.total,
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách quiz:', error);
      alert('Không thể tải danh sách quiz. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const getDifficultyBadge = (level) => {
    const badges = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    const labels = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[level]}`}>
        {labels[level]}
      </span>
    );
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark">
            <h1 className="text-[#111418] dark:text-white text-xl font-bold">Thư viện Quiz</h1>
          </header>

          <div className="flex-1 p-10">
            <div className="max-w-7xl mx-auto">
              {/* Filters */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tìm kiếm
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên quiz..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Môn học
                    </label>
                    <select
                      value={filters.subject_id}
                      onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Tất cả môn học</option>
                      {subjects.map((subject) => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                          {subject.subject_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Độ khó
                    </label>
                    <select
                      value={filters.difficulty_level}
                      onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Tất cả độ khó</option>
                      <option value="easy">Dễ</option>
                      <option value="medium">Trung bình</option>
                      <option value="hard">Khó</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-4 text-gray-600 dark:text-gray-400">
                Tìm thấy <span className="font-semibold text-[#111418] dark:text-white">{pagination.total}</span> quiz
              </div>

              {/* Quiz Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Không tìm thấy quiz nào
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.quiz_id}
                      className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/student/quiz/${quiz.quiz_id}`)}
                    >
                      {quiz.cover_image_url && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={quiz.cover_image_url}
                            alt={quiz.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-[#111418] dark:text-white line-clamp-2 flex-1">
                            {quiz.title}
                          </h3>
                        </div>

                        {quiz.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {quiz.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          {getDifficultyBadge(quiz.difficulty_level)}
                          {quiz.subject_name && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                              {quiz.subject_name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{quiz.attempt_count || 0} lượt làm</span>
                          <span className="font-semibold text-[#111418] dark:text-white">
                            {quiz.total_score} điểm
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Trước
                  </Button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium ${
                              pageNum === pagination.page
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === pagination.page - 2 ||
                        pageNum === pagination.page + 2
                      ) {
                        return <span key={pageNum}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizLibraryPage;
