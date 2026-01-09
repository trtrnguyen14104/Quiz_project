import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="flex h-screen min-h-full flex-col justify-between bg-white dark:bg-[#182431] p-4 border-r border-gray-200 dark:border-gray-700 w-64 fixed">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              QuizLearn
            </h2>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <a
            onClick={() => navigate('/admin/dashboard')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
              isActive('/admin/dashboard')
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300'
            }`}
          >
            <p className="text-sm font-medium">Dashboard</p>
          </a>
          <a
            onClick={() => navigate('/admin/users')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
              isActive('/admin/users')
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300'
            }`}
          >
            <p className="text-sm font-medium">Người dùng</p>
          </a>
          <a
            onClick={() => navigate('/admin/quizzes')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
              isActive('/admin/quizzes')
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300'
            }`}
          >
            <p className="text-sm font-medium">Quiz</p>
          </a>
          <a
            onClick={() => navigate('/admin/classes')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
              isActive('/admin/classes')
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300'
            }`}
          >
            <p className="text-sm font-medium">Lớp học</p>
          </a>
        </nav>
      </div>
      <div className="flex flex-col gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300 text-left w-full"
        >
          <p className="text-sm font-medium">Đăng xuất</p>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
