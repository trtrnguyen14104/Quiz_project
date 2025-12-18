import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/dashboard/teacher/TeacherSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { teacherAPI } from '../../services/api.js';

const TeacherClassDetailPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [classData, setClassData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quizzes');

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  const fetchClassDetail = async () => {
    try {
      const [classesRes, quizzesRes] = await Promise.all([
        teacherAPI.getClasses(),
        teacherAPI.getQuizzes(),
      ]);

      const foundClass = classesRes.data.find((c) => c.id === parseInt(classId));
      setClassData(foundClass);

      const classQuizzes = quizzesRes.data.filter((q) => q.classId === parseInt(classId));
      setQuizzes(classQuizzes);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết lớp:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!confirm('Bạn có chắc muốn xóa lớp này? Tất cả quiz và dữ liệu liên quan sẽ bị xóa.'))
      return;

    try {
      await teacherAPI.deleteClass(classId);
      alert('Xóa lớp thành công!');
      navigate('/teacher/classes');
    } catch (error) {
      console.error('Lỗi khi xóa lớp:', error);
      alert('Không thể xóa lớp. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Lớp học không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex min-h-screen">
        <TeacherSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f] sticky top-0 z-10">
            <div>
              <h1 className="text-[#111418] dark:text-white text-lg font-bold">
                {classData.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mã lớp: {classData.code}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/teacher/class/${classId}/manage`)}>
                Quản lý
              </Button>
              <button
                onClick={handleDeleteClass}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Xóa lớp
              </button>
            </div>
          </header>

          <div className="flex-1 p-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Số học sinh</p>
                <p className="text-3xl font-bold text-[#111418] dark:text-white">
                  {classData.studentCount}
                </p>
              </div>
              <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Số quiz</p>
                <p className="text-3xl font-bold text-[#111418] dark:text-white">
                  {quizzes.length}
                </p>
              </div>
              <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm trung bình</p>
                <p className={`text-3xl font-bold ${
                  classData.score >= 90
                    ? 'text-green-600'
                    : classData.score >= 80
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {classData.score || 0}%
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`pb-3 px-4 font-medium ${
                  activeTab === 'quizzes'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Quiz ({quizzes.length})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`pb-3 px-4 font-medium ${
                  activeTab === 'students'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Học sinh ({classData.studentCount})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 px-4 font-medium ${
                  activeTab === 'analytics'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Phân tích
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'quizzes' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                    Danh sách Quiz
                  </h2>
                  <Button onClick={() => navigate('/teacher/create-quiz')}>
                    Tạo quiz mới
                  </Button>
                </div>

                {quizzes.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Chưa có quiz nào trong lớp này
                    </p>
                    <Button onClick={() => navigate('/teacher/create-quiz')}>
                      Tạo quiz đầu tiên
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Tên Quiz
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Số câu
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Trạng thái
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {quizzes.map((quiz) => (
                          <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">
                              {quiz.title}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {quiz.questionCount}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  quiz.status === 'live'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                                    : quiz.status === 'graded'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {quiz.status === 'live'
                                  ? 'Đang diễn ra'
                                  : quiz.status === 'graded'
                                  ? 'Đã chấm'
                                  : 'Nháp'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => navigate(`/teacher/quiz/${quiz.id}`)}
                                className="text-primary font-medium hover:underline"
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                  Danh sách học sinh sẽ được hiển thị ở đây
                </p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                  Biểu đồ phân tích sẽ được hiển thị ở đây
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherClassDetailPage;
