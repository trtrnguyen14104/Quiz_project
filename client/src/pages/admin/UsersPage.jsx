import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/dashboard/admin/AdminSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { adminAPI } from '../../services/api.js';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, student, teacher, admin
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filter]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: filter !== 'all' ? filter : undefined,
      });
      if (response.data.wasSuccessful) {
        setUsers(response.data.result.users || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.result.total || response.data.result.users?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải người dùng:', error);
      alert('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      await adminAPI.deleteUser(userId);
      alert('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert('Không thể xóa người dùng. Vui lòng thử lại.');
    }
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
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      alert('Không thể cập nhật người dùng. Vui lòng thử lại.');
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
      teacher: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
      student: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
    };
    return styles[role] || styles.student;
  };

  const getRoleText = (role) => {
    const text = {
      admin: 'Quản trị viên',
      teacher: 'Giáo viên',
      student: 'Học sinh',
    };
    return text[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex min-h-screen">
        <AdminSidebar user={user} />

        <main className="flex-1 flex flex-col ml-64">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f] sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Quản lý người dùng</h1>
          </header>

          <div className="flex-1 p-10">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                Tất cả ({pagination.total})
              </button>
              <button
                onClick={() => handleFilterChange('student')}
                className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${
                  filter === 'student'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                Học sinh
              </button>
              <button
                onClick={() => handleFilterChange('teacher')}
                className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${
                  filter === 'teacher'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                Giáo viên
              </button>
              <button
                onClick={() => handleFilterChange('admin')}
                className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${
                  filter === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-[#18232f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                Quản trị viên
              </button>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">Không có người dùng nào</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18232f] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f6f7f8] dark:bg-[#101922]">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Người dùng
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Email
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Vai trò
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Trạng thái
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Ngày tạo
                        </th>
                        <th className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u.user_id}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {u.avatar_url ? (
                                <img
                                  src={u.avatar_url}
                                  alt={u.user_name}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-primary font-medium">
                                    {u.user_name?.[0]?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span className="font-medium text-[#111418] dark:text-white">
                                {u.user_name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {u.email}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(u.role)}`}>
                              {getRoleText(u.role)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              u.is_verified
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                            }`}>
                              {u.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setShowEditModal(true);
                                }}
                                className="text-primary font-medium text-sm hover:underline"
                              >
                                Chỉnh sửa
                              </button>
                              
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {Math.ceil(pagination.total / pagination.limit) > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Trước
                </Button>

                <div className="flex gap-2">
                  {[...Array(Math.ceil(pagination.total / pagination.limit))].map((_, index) => {
                    const pageNum = index + 1;
                    const totalPages = Math.ceil(pagination.total / pagination.limit);
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            pageNum === pagination.page
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === pagination.page - 2 ||
                      pageNum === pagination.page + 2
                    ) {
                      return <span key={pageNum} className="text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                >
                  Sau
                </Button>
              </div>
            )}
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

export default AdminUsersPage;
