import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import { studentAPI } from '../../services/api.js';

const ClassDetailPage = () => {
  const { class_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [classData, setClassData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quizzes'); // quizzes, students, info

  useEffect(() => {
    fetchClassDetail();
  }, [class_id]);

  const fetchClassDetail = async () => {
    try {
      const [classRes, quizzesRes, studentsRes] = await Promise.all([
        studentAPI.getClasses(),
        studentAPI.getClassQuizzes(class_id),
        studentAPI.getClassStudents(class_id),
      ]);

      const foundClass = classRes.data.result
        ? classRes.data.result.find((c) => c.class_id === parseInt(class_id))
        : classRes.data.find((c) => c.class_id === parseInt(class_id));
      setClassData(foundClass);

      setQuizzes(quizzesRes.data.result || []);

      setStudents(studentsRes.data.result || []);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết lớp:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Lớp học không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
            <div>
              <h1 className="text-[#111418] dark:text-white text-lg font-bold">
                {classData.class_name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Giáo viên: {classData.teacher_name}
              </p>
            </div>
          </header>

          <div className="flex-1 p-10">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10">
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`pb-3 px-4 font-medium ${
                  activeTab === 'quizzes'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Quiz ({quizzes.length})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`pb-3 px-4 font-medium ${
                  activeTab === 'students'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Học sinh ({classData.student_count})
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-3 px-4 font-medium ${
                  activeTab === 'info'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Thông tin
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'quizzes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">
                    Chưa có quiz nào trong lớp này
                  </p>
                ) : (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz.quiz_id}
                      className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/student/quiz/${quiz.quiz_id}`)}
                    >
                      <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {quiz.question_count} câu hỏi • Độ khó: {quiz.difficulty_level}
                      </p>
                      {quiz.completed && quiz.score !== null && (
                        <p className="text-sm font-medium text-primary mb-2">
                          Điểm: {quiz.score}/{quiz.total_score}
                        </p>
                      )}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            quiz.completed
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400'
                          }`}
                        >
                          {quiz.completed ? 'Đã làm' : 'Chưa làm'}
                        </span>
                        {quiz.due_date && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Hạn: {new Date(quiz.due_date).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                      {quiz.completed && quiz.completed_at && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Hoàn thành: {new Date(quiz.completed_at).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                {students.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                    Chưa có học sinh nào trong lớp này
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Học sinh
                          </th>
                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quiz hoàn thành
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Điểm TB
                          </th> */}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Ngày tham gia
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-white/10">
                        {students.map((student) => (
                          <tr key={student.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {student.avatar_url ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={student.avatar_url}
                                    alt={student.user_name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                    {student.user_name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-[#111418] dark:text-white">
                                    {student.user_name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {student.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#111418] dark:text-white">
                                {student.completed_quizzes || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#111418] dark:text-white">
                                {student.average_score
                                  ? parseFloat(student.average_score).toFixed(1)
                                  : '-'}
                              </div>
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {new Date(student.joined_at).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tên lớp
                    </h3>
                    <p className="text-lg text-[#111418] dark:text-white">{classData.class_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Giáo viên
                    </h3>
                    <p className="text-lg text-[#111418] dark:text-white">{classData.teacher_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Mã lớp
                    </h3>
                    <p className="text-lg font-mono font-bold text-[#111418] dark:text-white">
                      {classData.class_code}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Môn học
                    </h3>
                    <p className="text-lg text-[#111418] dark:text-white">
                      {classData.subject_name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Số học sinh
                    </h3>
                    <p className="text-lg text-[#111418] dark:text-white">
                      {classData.student_count} người
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassDetailPage;
