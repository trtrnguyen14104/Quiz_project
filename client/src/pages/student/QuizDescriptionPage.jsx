import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { studentAPI } from '../../services/api.js';

const QuizDescriptionPage = () => {
  const { quiz_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attemptInfo, setAttemptInfo] = useState(null);

  useEffect(() => {
    fetchQuizInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz_id]);

  const fetchQuizInfo = async () => {
    try {
      const response = await studentAPI.getQuizWithQuestions(quiz_id);
      const quizData = response.data.result;

      setQuiz(quizData);

      const hasMaxAttempts = quizData.max_attempts !== null && quizData.max_attempts !== undefined;

      if (hasMaxAttempts) {
        const attemptsCount = quizData.user_attempts_count || 0;
        const canAttempt = attemptsCount < quizData.max_attempts;
        const latestAttemptId = quizData.latest_attempt_id;

        setAttemptInfo({
          current: attemptsCount,
          max: quizData.max_attempts,
          canAttempt,
          latestAttemptId
        });
      } else {
        setAttemptInfo({
          current: quizData.user_attempts_count || 0,
          max: null,
          canAttempt: true,
          latestAttemptId: quizData.latest_attempt_id
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin quiz:', error);
      alert('Không thể tải thông tin quiz. Vui lòng thử lại.');
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (attemptInfo && !attemptInfo.canAttempt) {
      alert('Bạn đã hết lượt làm bài cho quiz này!');
      return;
    }
    navigate(`/student/quiz/${quiz_id}/take`);
  };

  const handleViewResult = () => {
    if (attemptInfo && attemptInfo.latestAttemptId) {
      navigate(`/student/result/${attemptInfo.latestAttemptId}`);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quiz này?')) {
      return;
    }

    try {
      await studentAPI.deleteQuiz(quiz_id);
      alert('Xóa quiz thành công!');
      navigate('/student/my-quizzes');
    } catch (error) {
      console.error('Lỗi khi xóa quiz:', error);
      alert('Không thể xóa quiz. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-gray-500 dark:text-gray-400">Quiz không tồn tại</p>
      </div>
    );
  }

  const canAttempt = !attemptInfo || attemptInfo.canAttempt;

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark">
            <h1 className="text-[#111418] dark:text-white text-xl font-bold">Thông tin Quiz</h1>
            <div className="flex items-center gap-3">
              {quiz && quiz.creator_id === user?.user_id && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/student/quiz/${quiz_id}/edit`)}
                  >
                    Sửa Quiz
                  </Button>
                  <button
                    onClick={handleDeleteQuiz}
                    className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Xóa Quiz
                  </button>
                </>
              )}
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Quay lại
              </button>
            </div>
          </header>

          <div className="flex-1 p-10">
            <div className="max-w-4xl mx-auto">
              {/* Quiz Cover Image */}
              {quiz.cover_image_url && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img
                    src={quiz.cover_image_url}
                    alt={quiz.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Quiz Title & Description */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-8 mb-6">
                <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">
                  {quiz.title}
                </h1>

                {quiz.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {quiz.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Số câu hỏi</p>
                    <p className="text-2xl font-bold text-[#111418] dark:text-white">
                      {quiz.statistics?.question_count || quiz.questions?.length || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng điểm</p>
                    <p className="text-2xl font-bold text-[#111418] dark:text-white">
                      {quiz.total_score}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Độ khó</p>
                    <p className="text-2xl font-bold text-[#111418] dark:text-white capitalize">
                      {quiz.difficulty_level === 'easy' ? 'Dễ' : quiz.difficulty_level === 'medium' ? 'Trung bình' : 'Khó'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chế độ</p>
                    <p className="text-2xl font-bold text-[#111418] dark:text-white">
                      {quiz.result_mode === 'practice' ? 'Luyện tập' : 'Thi'}
                    </p>
                  </div>
                </div>

                {/* Attempt Info */}
                {attemptInfo && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <span className="font-semibold">Số lần đã làm:</span> {attemptInfo.current}
                      {attemptInfo.max !== null && ` / ${attemptInfo.max}`}
                      {attemptInfo.max === null && ' (không giới hạn)'}
                    </p>
                    {!attemptInfo.canAttempt && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                        Bạn đã hết lượt làm bài cho quiz này!
                      </p>
                    )}
                  </div>
                )}

                {/* Quiz Mode Description */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-[#111418] dark:text-white mb-2">
                    {quiz.result_mode === 'practice' ? '📝 Chế độ Luyện tập' : '📋 Chế độ Thi'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {quiz.result_mode === 'practice'
                      ? 'Bạn sẽ thấy đáp án đúng và điểm số ngay sau khi chọn mỗi câu trả lời.'
                      : 'Bạn sẽ chỉ thấy kết quả sau khi hoàn thành toàn bộ bài quiz.'}
                  </p>
                </div>

                {quiz.due_date && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <span className="font-semibold">Hạn nộp:</span>{' '}
                    {new Date(quiz.due_date).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {canAttempt && (
                    <Button onClick={handleStartQuiz} className="flex-1">
                      Bắt đầu làm bài
                    </Button>
                  )}
                  {attemptInfo && attemptInfo.latestAttemptId && (
                    <Button
                      onClick={handleViewResult}
                      variant={canAttempt ? "secondary" : "primary"}
                      className={canAttempt ? "" : "flex-1"}
                    >
                      Xem kết quả
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Quay lại
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-[#111418] dark:text-white mb-4">Lưu ý</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Đảm bảo kết nối internet ổn định trong suốt quá trình làm bài</li>
                  <li>• Không tải lại trang khi đang làm bài để tránh mất dữ liệu</li>
                  <li>• Hãy đọc kỹ câu hỏi trước khi chọn đáp án</li>
                  {quiz.time_limit && (
                    <li>• Bạn có {quiz.time_limit} phút để hoàn thành bài quiz</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizDescriptionPage;
