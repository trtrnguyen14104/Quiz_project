import '../index.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/dashboard/student/StudentSidebar.jsx';
import Button from '../components/common/Button.jsx';
import { studentAPI } from '../services/api.js';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
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

      const [quizzesRes, resultsRes, classesRes] = await Promise.all([
        studentAPI.getQuizzes(),
        studentAPI.getResults(),
        studentAPI.getClasses(),
      ]);

      setQuizzes(quizzesRes.data);
      setResults(resultsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Lỗi load data:', error);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  const QuizCard = ({ quiz }) => (
    <div className="flex flex-col bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 gap-4">
      <h3 className="text-[#111418] dark:text-white text-lg font-bold">{quiz.title}</h3>
      <p className="text-[#617589] dark:text-gray-400 text-sm">{quiz.questionCount} Câu hỏi</p>
      <div className="flex items-center justify-between mt-2">
        <span
          className={`text-sm font-medium px-2.5 py-1 rounded-full ${
            quiz.status === 'active'
              ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50'
              : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50'
          }`}
        >
          {quiz.status === 'active' ? 'Active' : 'Draft'}
        </span>
        <button
          onClick={() => navigate(`/student/quiz/${quiz.id}`)}
          className="text-primary dark:text-primary-400 text-sm font-bold hover:underline"
        >
          {quiz.status === 'active' ? 'View Quiz' : 'Edit Quiz'}
        </button>
      </div>
    </div>
  );

  const AddQuizCard = () => (
    <div
      onClick={() => navigate('/student/create-quiz')}
      className="flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 gap-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <p className="text-[#617589] dark:text-gray-400 font-medium">Tạo quiz mới</p>
    </div>
  );

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
                  {/* <div className="text-[#617589] dark:text-gray-400 flex bg-[#f0f2f4] dark:bg-white/5 items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <span className="material-symbols-outlined">search</span>
                  </div> */}
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] dark:bg-white/5 focus:border-none h-full placeholder:text-[#617589] dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    placeholder="Tìm kiếm quiz hoặc lớp học..."
                  />
                </div>
              </label>
            </div>
            <div className="flex flex-1 justify-end gap-4 items-center">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-[#111418] dark:text-gray-300 dark:hover:bg-white/5 hover:bg-black/5 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <span className="material-symbols-outlined">Thông báo</span>
              </button>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
                style={{
                  backgroundImage: user?.avatar 
                    ? `url(${user.avatar})`
                    : 'url(/assets/images/default-avatar.png)',
                }}
                onClick={() => navigate('/student/profile')}
              />
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-10">
            <div className="flex flex-col gap-8">
              {/* Page Heading & Buttons */}
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                    Chào mừng trở lại, {user?.name?.split(' ')[0] || 'Student'}!
                  </p>
                </div>
                <div className="flex flex-1 gap-3 flex-wrap justify-start sm:justify-end">
                  <Button onClick={() => navigate('/student/join-class')}>Tham gia lớp</Button>
                  <Button variant="secondary" onClick={() => navigate('/student/join-quiz')}>
                    Nhập mã Quiz
                  </Button>
                </div>
              </div>

              {/* My Quizzes Section */}
              <div>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                  Quiz của tôi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
                  <AddQuizCard />
                </div>
              </div>

              {/* Recent Results & Classes */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">
                {/* Recent Results */}
                <div className="lg:col-span-3">
                  <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                    Kết quả gần đây
                  </h2>
                  <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200 dark:divide-white/10">
                        {results.map((result) => (
                          <li key={result.id} className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                <span className="material-symbols-outlined text-2xl text-primary">quiz</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {result.quizTitle}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  Completed on: {new Date(result.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                {result.score}%
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

                {/* Classes Joined */}
                <div className="lg:col-span-2">
                  <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                    Lớp đã tham gia
                  </h2>
                  <div className="flex flex-col gap-4">
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 gap-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/student/class/${cls.id}`)}
                      >
                        <div className={`bg-${cls.color}-100 dark:bg-${cls.color}-900/50 rounded-lg p-3`}>
                          <span className={`material-symbols-outlined text-${cls.color}-600 dark:text-${cls.color}-400`}>
                            {cls.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">{cls.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{cls.teacher}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">group</span>
                          {cls.studentCount}
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