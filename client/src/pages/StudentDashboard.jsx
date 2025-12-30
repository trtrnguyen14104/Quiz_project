import '../index.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/dashboard/student/StudentSidebar.jsx';
import Button from '../components/common/Button.jsx';
import { studentAPI } from '../services/api.js';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [recentlyJoinedQuizzes, setRecentlyJoinedQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    const response = await studentAPI.getDashboard();
    const { recent_attempts, classes, assigned_quizzes, recently_joined_quizzes } = response.data.result;

    setAssignedQuizzes(assigned_quizzes || []);
    setRecentlyJoinedQuizzes(recently_joined_quizzes || []);
    setResults(recent_attempts);
    setClasses(classes);
  } catch (error) {
    console.error('Lỗi load data:', error);
  }
};

  const QuizCard = ({ quiz }) => {
    const handleQuizClick = () => {
      // Always navigate to QuizDescriptionPage
      navigate(`/student/quiz/${quiz.quiz_id}`);
    };

    return (
      <div
        onClick={handleQuizClick}
        className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{quiz.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {quiz.question_count} câu hỏi • {quiz.class_name}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              quiz.completed
                ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400'
            }`}
          >
            {quiz.completed ? 'Đã làm' : 'Chưa làm'}
          </span>

          {quiz.completed && quiz.score !== null && quiz.total_score && (
            <span className="text-sm font-bold text-primary">
              {((quiz.score / quiz.total_score) * 100).toFixed(1)}%
            </span>
          )}
        </div>

        {quiz.due_date && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Hạn: {new Date(quiz.due_date).toLocaleDateString('vi-VN')}
          </p>
        )}
      </div>
    );
  };


  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
            <div className="flex items-center gap-8">
              <label className="flex flex-col min-w-40 !h-10 w-96">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] dark:bg-white/5 focus:border-none h-full placeholder:text-[#617589] dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    placeholder="Tìm kiếm quiz hoặc lớp học..."
                  />
                </div>
              </label>
            </div>
          </header>

          <div className="flex-1 p-10">
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                    Chào mừng trở lại, {user?.user_name || 'Student'}!
                  </p>
                </div>
                <div className="flex flex-1 gap-3 flex-wrap justify-start sm:justify-end">
                  <Button onClick={() => navigate('/student/join-class')}>Tham gia lớp</Button>
                  <Button variant="secondary" onClick={() => navigate('/student/join-quiz')}>
                    Nhập mã Quiz
                  </Button>
                </div>
              </div>

              {/* Quiz được giao */}
              <div>
                <div className="flex items-center justify-between pb-3 pt-5">
                  <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                    Quiz được giao
                  </h2>
                  <button 
                    onClick={() => navigate('/student/my-quizzes')}
                    className="text-primary dark:text-primary-400 text-sm font-bold hover:underline"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {assignedQuizzes.length > 0 ? (
                    assignedQuizzes.map((quiz) => (
                      <QuizCard key={quiz.quiz_id} quiz={quiz} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                      Chưa có quiz nào được giao
                    </div>
                  )}
                </div>
              </div>

              {/* Quiz tham gia gần đây */}
              <div>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                  Quiz tham gia gần đây
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentlyJoinedQuizzes.length > 0 ? (
                    recentlyJoinedQuizzes.map((quiz) => (
                      <div
                        key={quiz.quiz_id}
                        onClick={() => navigate(`/student/quiz/${quiz.quiz_id}`)}
                        className="flex flex-col bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <h3 className="text-[#111418] dark:text-white text-lg font-bold">{quiz.title}</h3>
                        <p className="text-[#617589] dark:text-gray-400 text-sm">{quiz.question_count} Câu hỏi</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(quiz.last_attempt_time).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {((quiz.last_score / quiz.max_score) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                      Chưa tham gia quiz nào
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">
                <div className="lg:col-span-3">
                  <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                    Kết quả gần đây
                  </h2>
                  <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200 dark:divide-white/10">
                        {results.map((result) => (
                          <li key={result.attempt_id} className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {result.quiz_title}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {result.class_name} • {new Date(result.end_time).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                {((result.total_score / result.max_score) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => navigate('/student/results')}
                      className="w-full mt-4 text-center text-primary text-sm font-bold hover:underline"
                    >
                      Xem tất cả kết quả
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                    Lớp đã tham gia
                  </h2>
                  <div className="flex flex-col gap-4">
                    {classes.map((cls) => (
                      <div
                        key={cls.class_id}
                        className="flex items-center bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 gap-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/student/class/${cls.class_id}`)}>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">{cls.class_name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{cls.teacher_name}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">group</span>
                          {cls.student_count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;