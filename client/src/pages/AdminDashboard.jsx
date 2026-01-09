import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api.js';
import Button from '../components/common/Button.jsx';
import AdminSidebar from '../components/dashboard/admin/AdminSidebar.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    activeClasses: 0,
    completionRate: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));

      const [dashboardRes, usersRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers(),
      ]);

      if (dashboardRes.data.wasSuccessful) {
        const statistics = dashboardRes.data.result.statistics;
        setStats({
          totalUsers: statistics.total_users || 0,
          totalQuizzes: statistics.total_quizzes || 0,
          activeClasses: statistics.total_classes || 0,
          completionRate: statistics.total_attempts > 0
            ? Math.round((statistics.total_attempts / statistics.total_quizzes) * 100)
            : 0,
        });
      }

      if (usersRes.data.wasSuccessful) {
        setUsers(usersRes.data.result.users || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u.user_id !== userId));
        alert('Xóa người dùng thành công!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Không thể xóa người dùng. Vui lòng thử lại.');
      }
    }
  };

  const handleOpenEditModal = (usr) => {
    setSelectedUser({
      user_id: usr.user_id,
      user_name: usr.user_name,
      email: usr.email,
      role: usr.role,
      status: usr.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateUser(selectedUser.user_id, {
        role: selectedUser.role,
        status: selectedUser.status
      });
      alert('Cập nhật người dùng thành công!');
      setShowEditModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      alert('Không thể cập nhật người dùng. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <div className="flex h-full w-full">
        <AdminSidebar user={user} />

        <main className="flex flex-col flex-1 ml-64">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-4 bg-white dark:bg-[#182431] sticky top-0 z-10">
            <div className="flex flex-1 justify-end items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-left">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Quản Trị Viên</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Tổng Người Dùng</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Tổng Quiz</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.totalQuizzes}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Lớp Đang Hoạt Động</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.activeClasses}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Tỷ Lệ Hoàn Thành</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.completionRate}%</p>
              </div>
            </div>

            {/* User Management Table */}
            <div className="mt-8">
              <div className="flex justify-between items-center pb-3 pt-5">
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold">Quản Lý Người Dùng</h2>
                <div className="flex items-center gap-4">
                  {users.length > 10 && (
                    <button
                      onClick={() => navigate('/admin/users')}
                      className="text-primary dark:text-primary-400 text-sm font-bold hover:underline"
                    >
                      Xem tất cả
                    </button>
                  )}
                  <Button onClick={() => navigate('/admin/users/new')} icon={<span className="material-symbols-outlined text-xl">add</span>}>
                    Thêm Người Dùng Mới
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto bg-white dark:bg-[#182431] rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-[#333333] dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Tên</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Vai Trò</th>
                      <th className="px-6 py-3">Ngày Tạo</th>
                      <th className="px-6 py-3">Trạng Thái</th>
                      <th className="px-6 py-3">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((usr) => (
                      <tr key={usr.user_id} className="bg-white dark:bg-[#182431] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4">#{usr.user_id}</td>
                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{usr.user_name}</th>
                        <td className="px-6 py-4">{usr.email}</td>
                        <td className="px-6 py-4 capitalize">{usr.role}</td>
                        <td className="px-6 py-4">{usr.created_at ? new Date(usr.created_at).toLocaleString() : '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${usr.is_verified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                            {usr.is_verified ? 'Đã Xác Thực' : 'Chưa Xác Thực'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => handleOpenEditModal(usr)} className="text-primary hover:text-primary/80">
                            <span className="text-primary font-medium text-sm hover:underline">Chỉnh sửa</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-[#18232f] rounded-xl p-8 max-w-md w-full mx-4">
                  <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
                    Chỉnh sửa người dùng
                  </h2>
                  <form onSubmit={handleEditUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                        Tên người dùng
                      </label>
                      <input
                        type="text"
                        value={selectedUser.user_name}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={selectedUser.email}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                        Vai trò
                      </label>
                      <select
                        value={selectedUser.role}
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-[#111418] dark:text-white"
                      >
                        <option value="student">Học sinh</option>
                        <option value="teacher">Giáo viên</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                        Trạng thái tài khoản
                      </label>
                      <select
                        value={selectedUser.status || 'active'}
                        onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-[#111418] dark:text-white"
                      >
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Tạm khóa</option>
                      </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="submit">Lưu thay đổi</Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowEditModal(false)}
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

export default AdminDashboard;