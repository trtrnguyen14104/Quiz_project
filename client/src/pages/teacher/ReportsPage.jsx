import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/dashboard/teacher/TeacherSidebar.jsx';
import { teacherAPI } from '../../services/api.js';

const ReportsPage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeQuizzes: 0,
    averageScore: 0,
    totalClasses: 0,
  });
  const [classStats, setClassStats] = useState([]);
  const [quizStats, setQuizStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [dashboardRes, classesRes, quizzesRes] = await Promise.all([
        teacherAPI.getDashboard(),
        teacherAPI.getClasses(),
        teacherAPI.getQuizzes(),
      ]);

      setStats(dashboardRes.data.stats || {});
      setClassStats(dashboardRes.data.classes || []);
      setQuizStats(dashboardRes.data.quizzes || []);
    } catch (error) {
      console.error('Lỗi khi tải báo cáo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex min-h-screen">
        <TeacherSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f] sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Báo cáo & Thống kê</h1>
          </header>

          <div className="flex-1 p-10">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Overview Stats */}
                <div>
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">
                    Tổng quan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng số lớp</p>
                      <p className="text-3xl font-bold text-[#111418] dark:text-white">
                        {stats.totalClasses || classStats.length}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng học sinh</p>
                      <p className="text-3xl font-bold text-[#111418] dark:text-white">
                        {stats.totalStudents}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quiz hoạt động</p>
                      <p className="text-3xl font-bold text-[#111418] dark:text-white">
                        {stats.activeQuizzes}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm TB chung</p>
                      <p className="text-3xl font-bold text-[#111418] dark:text-white">
                        {stats.averageScore}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Class Performance */}
                <div>
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">
                    Hiệu suất theo lớp
                  </h2>
                  <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Tên lớp
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Số học sinh
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Điểm trung bình
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Xu hướng
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {classStats.map((cls) => (
                          <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">
                              {cls.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {cls.studentCount}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-bold ${
                                cls.score >= 90
                                  ? 'text-green-600'
                                  : cls.score >= 80
                                  ? 'text-blue-600'
                                  : cls.score >= 70
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
                                {cls.score || 0}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-green-600 dark:text-green-400">↑</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quiz Statistics */}
                <div>
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">
                    Thống kê Quiz
                  </h2>
                  <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Tên Quiz
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Lớp
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Số lượt làm
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Điểm TB
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {quizStats.map((quiz) => (
                          <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">
                              {quiz.title}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {quiz.className || '-'}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {quiz.attemptCount || 0}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-[#111418] dark:text-white">
                                {quiz.averageScore || 0}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                quiz.status === 'live'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                                  : quiz.status === 'graded'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {quiz.status === 'live' ? 'Đang diễn ra' : quiz.status === 'graded' ? 'Đã chấm' : 'Nháp'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
