import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Button from '../../components/common/Button';
import AdminSidebar from '../../components/dashboard/admin/AdminSidebar';

const AddUserPage = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      const { user_name, email, password, role } = formData;
      await adminAPI.createUser({ user_name, email, password, role });

      alert('Tạo người dùng thành công');
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tạo người dùng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar user={user} />

      <main className="flex-1 ml-64">
        <header className="bg-white dark:bg-[#182431] border-b border-gray-200 dark:border-gray-700 px-10 py-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thêm Người Dùng Mới</h2>
        </header>

        <div className="p-10">
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#182431] rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên người dùng *
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    value={formData.user_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                    placeholder="Nhập tên người dùng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vai trò *
                  </label>
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                  >
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Tạo người dùng'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/admin/users')}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddUserPage;
