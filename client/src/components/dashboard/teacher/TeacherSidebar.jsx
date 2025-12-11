import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../common/Button';

const TeacherSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items cho teacher
  const menuItems = [
    {
      path: '/teacher/dashboard',
      label: 'Trang chính',
    },
    {
      path: '/teacher/classes',
      label: 'Lớp của tôi',
    },
    {
      path: '/teacher/quizzes',
      label: 'Quiz của tôi',
    },
    {
      path: '/teacher/reports',
      label: 'Thống kê',
    },
  ];

  // Kiểm tra menu item có đang active không
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#18232f] border-r border-gray-200 dark:border-gray-700">
      <div className="flex h-full min-h-[700px] flex-col justify-between p-4">
        
        {/* ===== TOP SECTION: Logo & Menu ===== */}
        <div className="flex flex-col gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 p-2">
            <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              QuizLearn
            </h2>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col gap-2 pt-4">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              
              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    active
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-[#111418] dark:text-gray-300'
                  }`}
                >   
                  <span 
                    className={`material-symbols-outlined ${active ? 'text-primary' : ''}`}
                    style={{
                      fontVariationSettings: active && item.filled ? "'FILL' 1" : "'FILL' 0"
                    }}
                  >
                    {item.icon}
                  </span>
                  <p className={`text-sm font-medium ${active ? 'text-primary' : ''}`}>
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== BOTTOM SECTION: Create Quiz Button ===== */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => navigate('/teacher/create-quiz')}
            className="w-full"
          >
            Tạo quiz mới
          </Button>

          {/* Optional: Settings & Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <div
              onClick={() => navigate('/teacher/settings')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
            >
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium">
                Cài đặt
              </p>
            </div>
            
            <div
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
            >
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium">
                Đăng xuất
              </p>
            </div>
          </div>

          {/* Optional: User Info */}
          {user && (
            <div className="flex gap-3 items-center mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: user.avatar
                    ? `url(${user.avatar})`
                    : 'url(/assets/images/default-avatar.png)',
                }}
              />
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-[#111418] dark:text-white text-sm font-medium truncate">
                  {user.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                  Giáo viên
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default TeacherSidebar;