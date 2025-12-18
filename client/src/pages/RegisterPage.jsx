import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { authAPI } from '../services/api.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if(response.data.wasSuccessful) 
        navigate('/verify-email');

    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
        <div className="flex items-center gap-3 text-text-light dark:text-text-dark">
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">QuizLearn</h2>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center py-8 px-4">
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <div className="w-full flex flex-col gap-4 text-center">
            <p className="text-4xl font-black leading-tight tracking-[-0.033em]">Tạo tài khoản của bạn</p>
            <p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal">
              Bắt đầu học tập với QuizLearn ngay hôm nay!
            </p>
          </div>

          {errors.general && (
            <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          <div className="w-full rounded-xl border border-border-light dark:border-border-dark bg-content-light dark:bg-content-dark p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                label="Họ và tên"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
                error={errors.username}
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                error={errors.email}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vai trò <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                </select>
              </div>

              <Input
                label="Mật khẩu"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                showPasswordToggle
                error={errors.password}
                required
              />

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu của bạn"
                showPasswordToggle
                error={errors.confirmPassword}
                required
              />

              <Button type="submit" size="lg" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;