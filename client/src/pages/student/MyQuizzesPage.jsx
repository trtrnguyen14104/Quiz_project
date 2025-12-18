import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import { studentAPI } from '../../services/api.js';

const MyQuizzesPage = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('created');
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const [createdRes, assignedRes, dashboardRes] = await Promise.all([
        studentAPI.getMyCreatedQuizzes(),
        studentAPI.getQuizzes({ status: 'all' }),
        studentAPI.getDashboard()
      ]);

      setCreatedQuizzes(createdRes.data.result || []);
      setAssignedQuizzes(assignedRes.data.result?.quizzes || []);
      setRecentQuizzes(dashboardRes.data.result?.recently_joined_quizzes || []);
    } catch (error) {
      console.error('Lỗi khi tải quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quiz) => {
    if (quiz.completed !== undefined) {
      const hasMaxAttempts = quiz.max_attempts !== null && quiz.max_attempts !== undefined;
      const reachedLimit = hasMaxAttempts && quiz.user_attempts_count >= quiz.max_attempts;

      if (quiz.completed && reachedLimit && quiz.latest_attempt_id) {
        navigate(`/student/result/${quiz.latest_attempt_id}`);
      } else {
        navigate(`/student/quiz/${quiz.quiz_id}`);
      }
    } else {
      navigate(`/student/quiz/${quiz.quiz_id}`);
    }
  };

  const completedAssigned = assignedQuizzes.filter(q => q.completed);
  const pendingAssigned = assignedQuizzes.filter(q => !q.completed);

  const tabs = [
    { id: 'created', label: 'Quiz của tôi', count: createdQuizzes.length },
    { id: 'assigned', label: 'Quiz được giao', count: assignedQuizzes.length },
    { id: 'recent', label: 'Tham gia gần đây', count: recentQuizzes.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />
        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark">
            <h1 className="text-[#111418] dark:text-white text-xl font-bold">Quiz của tôi</h1>
            <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Quay lại</button>
          </header>
          <div className="flex-1 p-10">
            <div className="border-b border-gray-200 dark:border-white/10 mb-6">
              <div className="flex gap-8">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id ? 'border-primary text-primary dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}>
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz tôi tạo */}
            {activeTab === 'created' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white">Quiz tôi tạo ({createdQuizzes.length})</h2>
                  <button onClick={() => navigate('/teacher/quizzes/create')} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">+ Tạo quiz mới</button>
                </div>
                {createdQuizzes.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-white/10">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Bạn chưa tạo quiz nào</p>
                    <button onClick={() => navigate('/teacher/quizzes/create')} className="text-primary hover:underline">Tạo quiz đầu tiên</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {createdQuizzes.map((quiz) => (
                      <div key={quiz.quiz_id} onClick={() => navigate(`/teacher/quizzes/${quiz.quiz_id}`)}
                        className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{quiz.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{quiz.question_count} câu hỏi • {quiz.subject_name}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${quiz.status === 'published' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400'}`}>
                            {quiz.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{quiz.total_attempts} lượt làm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quiz được giao */}
            {activeTab === 'assigned' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Chưa làm ({pendingAssigned.length})</h2>
                  {pendingAssigned.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-white/10">
                      <p className="text-gray-500 dark:text-gray-400">Không có quiz chưa làm</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {pendingAssigned.map((quiz) => (
                        <div key={quiz.quiz_id} onClick={() => handleQuizClick(quiz)}
                          className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                          <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{quiz.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{quiz.question_count} câu hỏi • {quiz.class_name}</p>
                          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400 mt-4">Chưa làm</span>
                          {quiz.due_date && <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Hạn: {new Date(quiz.due_date).toLocaleDateString('vi-VN')}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Đã làm ({completedAssigned.length})</h2>
                  {completedAssigned.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-white/10">
                      <p className="text-gray-500 dark:text-gray-400">Chưa hoàn thành quiz nào</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {completedAssigned.map((quiz) => (
                        <div key={quiz.quiz_id} onClick={() => handleQuizClick(quiz)}
                          className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                          <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{quiz.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{quiz.question_count} câu hỏi • {quiz.class_name}</p>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">Đã làm</span>
                            {quiz.score !== null && quiz.total_score && <span className="text-sm font-bold text-primary">{((quiz.score / quiz.total_score) * 100).toFixed(1)}%</span>}
                          </div>
                          {quiz.due_date && <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Hạn: {new Date(quiz.due_date).toLocaleDateString('vi-VN')}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quiz tham gia gần đây */}
            {activeTab === 'recent' && (
              <div>
                <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-6">Quiz tham gia gần đây ({recentQuizzes.length})</h2>
                {recentQuizzes.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-white/10">
                    <p className="text-gray-500 dark:text-gray-400">Bạn chưa tham gia quiz nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recentQuizzes.map((quiz) => (
                      <div key={quiz.quiz_id} onClick={() => handleQuizClick(quiz)}
                        className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{quiz.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{quiz.question_count} câu hỏi • {quiz.subject_name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(quiz.last_attempt_time).toLocaleDateString('vi-VN')}</span>
                          <span className="text-lg font-bold text-primary">{((quiz.last_score / quiz.max_score) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyQuizzesPage;
