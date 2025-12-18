import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/dashboard/teacher/TeacherSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { teacherAPI } from '../../services/api.js';

const ClassesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await teacherAPI.getClasses();
      setClasses(response.data.result.classes);
    } catch (error) {
      console.error('Lỗi khi tải lớp học:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await teacherAPI.createClass(newClass);
      setShowCreateModal(false);
      setNewClass({ name: '', description: '' });
      fetchClasses();
    } catch (error) {
      console.error('Lỗi khi tạo lớp:', error);
      alert('Không thể tạo lớp. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex min-h-screen">
        <TeacherSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f] sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Lớp của tôi</h1>
            <Button onClick={() => setShowCreateModal(true)}>
              Tạo lớp mới
            </Button>
          </header>

          <div className="flex-1 p-10">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Bạn chưa tạo lớp nào
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Tạo lớp đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <div
                    key={cls.class_id}
                    className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-1">
                          {cls.class_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {cls.student_count} học sinh
                        </p>
                      </div>
                      {/* <span className="material-symbols-outlined text-gray-400 text-2xl">
                        {cls.icon || 'school'}
                      </span> */}
                    </div>

                    {cls.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {cls.description}
                      </p>
                    )}

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Điểm trung bình gần đây
                      </p>
                      <p className='text-2xl font-bold text-green-600'>
                        {cls.score || 0}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/teacher/class/${cls.id}`)}
                        className="flex-1 rounded-lg h-9 px-3 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => navigate(`/teacher/class/${cls.id}/manage`)}
                        className="flex-1 rounded-lg h-9 px-3 bg-[#f0f2f4] dark:bg-[#101922] text-[#111418] dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        Quản lý
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Mã lớp: <span className="font-mono font-bold">{cls.code}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#18232f] rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
              Tạo lớp mới
            </h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                  Tên lớp *
                </label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                  Mô tả
                </label>
                <textarea
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit">Tạo lớp</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
