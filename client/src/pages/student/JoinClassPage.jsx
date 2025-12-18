import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { studentAPI } from '../../services/api.js';

const JoinClassPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    setError('');

    if (!classCode.trim()) {
      setError('Vui lòng nhập mã lớp');
      return;
    }

    setLoading(true);
    try {
      const response = await studentAPI.joinClass(classCode);
      alert('Tham gia lớp thành công!');
      navigate('/student/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Mã lớp không hợp lệ hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Tham gia lớp học</h1>
          </header>

          <div className="flex-1 p-10">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
                  Nhập mã lớp học
                </h2>

                <form onSubmit={handleJoinClass} className="space-y-6">
                  <div>
                    <Input
                      label="Mã lớp học"
                      type="text"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value)}
                      placeholder="Nhập mã lớp 6 ký tự"
                      required
                      maxLength={6}
                    />
                    {error && (
                      <p className="text-red-600 text-sm mt-2">{error}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Tham gia'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/student/dashboard')}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-[#111418] dark:text-white mb-2">
                    Hướng dẫn:
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Mã lớp học có 6 ký tự do giáo viên cung cấp</li>
                    <li>• Nhập chính xác mã lớp để tham gia</li>
                    <li>• Sau khi tham gia, bạn có thể xem các quiz của lớp</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JoinClassPage;
