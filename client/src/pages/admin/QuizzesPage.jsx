import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/dashboard/admin/AdminSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { adminAPI } from '../../services/api.js';

const AdminQuizzesPage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  useEffect(() => {
    fetchQuizzes();
  }, [pagination.page]);

  const fetchQuizzes = async () => {
    try {
      const response = await adminAPI.getQuizzes({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (response.data.wasSuccessful) {
        setQuizzes(response.data.result.quizzes || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.result.total || response.data.result.quizzes?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Bạn có chắc muốn xóa quiz này?')) return;

    try {
      await adminAPI.deleteQuiz(quizId);
      alert('Xóa quiz thành công!');
      fetchQuizzes();
    } catch (error) {
      console.error('Lỗi khi xóa quiz:', error);
      alert('Không thể xóa quiz');
    }
  };

  const handleUpdateAccessLevel = async (quizId, accessLevel) => {
    try {
      await adminAPI.updateQuiz(quizId, { access_level: accessLevel });
      alert('Cập nhật mức độ truy cập thành công!');
      fetchQuizzes();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Không thể cập nhật mức độ truy cập');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex min-h-screen">
        <AdminSidebar user={user} />

        <main className="flex-1 flex flex-col ml-64">
          <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f]">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Quản lý Quiz</h1>
          </header>

          <div className="flex-1 p-10">
            <div className="bg-white dark:bg-[#18232f] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#f6f7f8] dark:bg-[#101922]">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-500">Tên Quiz</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-500">Người tạo</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-500">Trạng thái</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-500">Ngày tạo</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-500">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.quiz_id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium text-[#111418] dark:text-white">{quiz.title}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{quiz.creator_name || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quiz.access_level === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                        }`}>
                          {quiz.access_level === 'public' ? 'Công khai' : 'Riêng tư'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateAccessLevel(quiz.quiz_id, quiz.access_level === 'public' ? 'private' : 'public')}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            {quiz.access_level === 'public' ? 'Ẩn' : 'Hiện'}
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.quiz_id)}
                            className="text-red-600 text-sm hover:underline"
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

            {/* Pagination */}
            {Math.ceil(pagination.total / pagination.limit) > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Trước
                </Button>

                <div className="flex gap-2">
                  {[...Array(Math.ceil(pagination.total / pagination.limit))].map((_, index) => {
                    const pageNum = index + 1;
                    const totalPages = Math.ceil(pagination.total / pagination.limit);
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
                      return <span key={pageNum} className="text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                >
                  Sau
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminQuizzesPage;
