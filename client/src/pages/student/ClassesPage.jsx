import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { studentAPI } from '../../services/api.js';

const ClassesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await studentAPI.getClasses();
      setClasses(response.data.result);
    } catch (error) {
      console.error('Lỗi khi tải lớp học:', error);
    } 
    finally {
      setLoading(false)
    ;
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Lớp đã tham gia</h1>
            <Button onClick={() => navigate('/student/join-class')}>
              Tham gia lớp mới
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
                  Bạn chưa tham gia lớp nào
                </p>
                <Button onClick={() => navigate('/student/join-class')}>
                  Tham gia lớp ngay
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <div
                    key={cls.class_id}
                    className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/student/class/${cls.class_id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-1">
                          {cls.class_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {cls.teacher_name}
                        </p>
                      </div>
                      {/* <div className={`bg-${cls.color || 'blue'}-100 dark:bg-${cls.color || 'blue'}-900/50 rounded-lg p-2`}>
                        <span className={`material-symbols-outlined text-${cls.color || 'blue'}-600 dark:text-${cls.color || 'blue'}-400`}>
                          {cls.icon || 'school'}
                        </span>
                      </div> */}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Học sinh:</span>
                        <span className="font-medium text-[#111418] dark:text-white">
                          {cls.student_count} người
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Quiz:</span>
                        <span className="font-medium text-[#111418] dark:text-white">
                          {cls.quiz_count || 0} bài
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Mã lớp: {cls.class_code}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/class/${cls.class_id}`);
                          }}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassesPage;
