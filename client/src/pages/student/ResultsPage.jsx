import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import { studentAPI } from '../../services/api.js';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await studentAPI.getResults();
      setResults(response.data.result.attempts);
    } catch (error) {
      console.error('Lỗi khi tải kết quả:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400';
    if (score >= 80) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400';
    if (score >= 70) return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400';
    return 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400';
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Kết quả của tôi</h1>
          </header>

          <div className="flex-1 p-10">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">
                  Bạn chưa hoàn thành quiz nào
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng số quiz</p>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">{results.length}</p>
                  </div>
                  <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm trung bình</p>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">
                      {(results.reduce((acc, r) => acc + (r.total_score / r.max_score * 100), 0) / results.length).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm cao nhất</p>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">
                      {Math.max(...results.map(r => (r.total_score / r.max_score * 100))).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Results Table */}
                <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Tên Quiz
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Ngày làm
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Số câu
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Điểm
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                      {results.map((result) => {
                        const scorePercentage = (result.total_score / result.max_score * 100).toFixed(1);
                        return (
                          <tr
                            key={result.attempt_id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <p className="font-medium text-[#111418] dark:text-white">
                                {result.quiz_title}
                              </p>
                              {result.class_name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {result.class_name}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(result.end_time).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {result.correct_answers}/{result.total_questions}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(parseFloat(scorePercentage))}`}>
                                {scorePercentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => navigate(`/student/result/${result.attempt_id}`)}
                                className="text-primary font-medium hover:underline"
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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

export default ResultsPage;
