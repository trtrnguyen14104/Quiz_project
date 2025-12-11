import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../common/Button.jsx';

const StudentSidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/student/dashboard', label: 'Trang chính' },
    { path: '/student/join-class', label: 'Tham gia lớp' },
    { path: '/student/join-quiz',  label: 'Tham gia Quiz' },
    { path: '/student/my-quizzes', label: 'Quiz của tôi' },
    { path: '/student/results', label: 'Kết quả của tôi' },
    { path: '/student/classes', label: 'Lớp đã tham gia' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white dark:bg-background-dark dark:border-r dark:border-white/10 shrink-0">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-2">
            <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              QuizLearn
            </h2>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-2 mt-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    isActive
                      ? 'bg-primary/10 dark:bg-primary/20'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {/* <span
                    className={`material-symbols-outlined ${
                      isActive ? 'text-primary dark:text-primary' : 'text-[#111418] dark:text-gray-300'
                    }`}
                  >
                    {item.icon}
                  </span> */}
                  <p
                    className={`text-base font-medium leading-normal ${
                      isActive ? 'text-primary dark:text-primary' : 'text-[#111418] dark:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate('/student/create-quiz')}>
            Tạo Quiz Mới
          </Button>

          <div className="border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
            <Link
              to="/student/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal">Cài đặt</p>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal">Đăng xuất</p>
            </button>
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex gap-3 items-center mt-2 px-3 py-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: user.avatar
                    ? `url(${user.avatar})`
                    : 'url(/assets/images/default-avatar.png)',
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-[#111418] dark:text-white text-base font-medium leading-normal">
                  {user.name}
                </h1>
                <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;