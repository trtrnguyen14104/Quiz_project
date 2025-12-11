import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../services/api';
import Button from '../components/common/Button';
import TeacherSidebar from '../components/dashboard/teacher/TeacherSidebar';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeQuizzes: 0,
    averageScore: 0,
  });
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));

      const dashboardRes = await teacherAPI.getDashboard();
      const { stats, classes, quizzes } = dashboardRes.data;
      
      setStats(stats);
      setClasses(classes);
      setQuizzes(quizzes);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  const getStatusBadge = (status) => {
    const styles = {
      graded: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
      live: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
      draft: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return styles[status] || styles.draft;
  };


  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#333333] dark:text-gray-200 min-h-screen">
      <div className="flex min-h-screen">
        
        <TeacherSidebar user={user} />

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 flex flex-col">
          
          {/* ===== HEADER ===== */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f] sticky top-0 z-10">
            <div className="flex items-center gap-8">
              {/* Search Bar */}
              <label className="flex flex-col w-96 !h-10">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-gray-500 dark:text-gray-400 flex bg-[#f0f2f4] dark:bg-[#101922] items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 rounded-r-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] dark:bg-[#101922] h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4" 
                    placeholder="Tìm kiếm lớp, quiz, học sinh..." 
                  />
                </div>
              </label>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Button */}
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f2f4] dark:bg-[#101922] text-[#111418] dark:text-white min-w-0 px-2.5 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined">Thông báo</span>
              </button>
              
              {/* User Avatar & Info */}
              <div className="flex gap-3 items-center">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
                  style={{
                    backgroundImage: user?.avatar 
                      ? `url(${user.avatar})` 
                      : 'url(/assets/images/default-avatar.png)'
                  }}
                  onClick={() => navigate('/teacher/profile')}
                />
                <div className="flex flex-col text-left">
                  <h1 className="text-[#111418] dark:text-white text-sm font-medium">
                    {user?.name || 'Giáo viên'}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {user?.subject || 'Giáo viên'}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* ===== MAIN CONTENT AREA ===== */}
          <div className="p-8 flex-1 overflow-y-auto">
            
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-3 mb-6">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-[#111418] dark:text-white text-3xl font-bold">
                  Xin chào, {user?.name?.split(' ')[0] || 'Giáo viên'}!
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-base">
                  Dưới đây là tổng quan quiz và lớp của bạn
                </p>
              </div>
            </div>

            {/* ===== STATISTICS CARDS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <p className="text-[#111418] dark:text-gray-300 text-base font-medium">
                  Số học sinh hiện tại
                </p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">
                  {stats.totalStudents}
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <p className="text-[#111418] dark:text-gray-300 text-base font-medium">
                  Quiz hoạt động
                </p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">
                  {stats.activeQuizzes}
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <p className="text-[#111418] dark:text-gray-300 text-base font-medium">
                  Điểm trung bình
                </p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">
                  {stats.averageScore}%
                </p>
              </div>
            </div>

            {/* ===== MY CLASSES SECTION ===== */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#111418] dark:text-white text-xl font-bold">
                  Lớp của tôi
                </h2>
                <button 
                  onClick={() => navigate('/teacher/classes/new')} 
                  className="flex items-center gap-2 justify-center rounded-lg h-9 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-colors"
                >
                  Thêm lớp mới
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <div 
                    key={cls.id} 
                    className="bg-white dark:bg-[#18232f] rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/teacher/class/${cls.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col flex-1">
                        <h3 className="font-bold text-lg text-[#111418] dark:text-white">
                          {cls.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {cls.studentCount} học sinh
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-gray-400 text-2xl">
                        {cls.icon}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Điểm trung bình gần đây
                      </p>
                      <p className={`text-2xl font-bold ${
                        cls.score >= 90 
                          ? 'text-green-600' 
                          : cls.score >= 80 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}>
                        {cls.score}%
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/teacher/class/${cls.id}`);
                        }}
                        className="flex-1 rounded-lg h-9 px-3 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/teacher/class/${cls.id}/manage`);
                        }}
                        className="flex-1 rounded-lg h-9 px-3 bg-[#f0f2f4] dark:bg-[#101922] text-[#111418] dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        Quản lý
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== MY QUIZZES TABLE ===== */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#111418] dark:text-white text-xl font-bold">
                  Quiz của tôi
                </h2>
                <Button onClick={() => navigate('/teacher/create-quiz')}>
                  Tạo quiz mới
                </Button>
              </div>
              
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
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((quiz) => (
                        <tr 
                          key={quiz.id} 
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                          onClick={() => navigate(`/teacher/quiz/${quiz.id}`)}
                        >
                          <td className="p-4 font-medium text-[#111418] dark:text-white">
                            {quiz.title}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {quiz.className}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {quiz.questionCount}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {quiz.dueDate || '-'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(quiz.status)}`}>
                              {quiz.status === 'graded' ? 'Đã chấm' : quiz.status === 'live' ? 'Đang diễn ra' : 'Nháp'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/teacher/quiz/${quiz.id}`);
                              }}
                              className="text-primary font-bold text-sm hover:underline"
                            >
                              {quiz.status === 'graded' ? 'Xem kết quả' : quiz.status === 'live' ? 'Giao bài' : 'Chỉnh sửa'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;