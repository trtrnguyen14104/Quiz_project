// Auth Service - Quản lý token và authentication
export const authService = {
  // Lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Lưu token vào localStorage
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Xóa token khỏi localStorage
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Lấy thông tin user
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Lưu thông tin user
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Xóa thông tin user
  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Logout - xóa tất cả thông tin auth
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
