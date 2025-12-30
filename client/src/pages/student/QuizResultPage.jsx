import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { studentAPI } from '../../services/api.js';

const QuizResultPage = () => {
  const { attempt_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [attempt_id]);

  const fetchResult = async () => {
    try {
      const response = await studentAPI.getAttemptResult(attempt_id);
      if (response.data.wasSuccessful) {
        setResult(response.data.result);
      } else {
        alert(response.data.message);
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('Lỗi khi tải kết quả:', error);
      alert('Không thể tải kết quả. Vui lòng thử lại.');
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (startTime, endTime) => {
    if (!endTime) return 'N/A';
    const diff = new Date(endTime) - new Date(startTime);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score, totalScore) => {
    const percentage = (score / totalScore) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy kết quả</p>
      </div>
    );
  }

  const { attempt, quiz, questions, statistics, user_attempts_count, max_attempts, can_retake } = result;
  const scorePercentage = quiz.total_score > 0 ? ((attempt.total_score / quiz.total_score) * 100).toFixed(1) : 0;

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark">
            <h1 className="text-[#111418] dark:text-white text-xl font-bold">Kết quả Quiz</h1>
            <button
              onClick={() => navigate('/student/results')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Quay lại danh sách
            </button>
          </header>

          <div className="flex-1 p-10">
            <div className="max-w-4xl mx-auto">
              {/* Score Summary */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-8 mb-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
                    {quiz.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hoàn thành lúc: {new Date(attempt.end_time).toLocaleString('vi-VN')}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm số</p>
                    <p className={`text-3xl font-bold ${getScoreColor(attempt.total_score, quiz.total_score)}`}>
                      {attempt.total_score}/{quiz.total_score}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {scorePercentage}%
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Câu đúng</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {statistics?.correct_count || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      / {statistics?.total_questions || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Câu sai</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {statistics?.incorrect_count || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      / {statistics?.total_questions || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Thời gian</p>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">
                      {formatTime(attempt.start_time, attempt.end_time)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      phút
                    </p>
                  </div>
                </div>

                {scorePercentage >= 80 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                    <p className="text-green-800 dark:text-green-300 font-semibold">
                      Xuất sắc! Bạn đã làm bài rất tốt!
                    </p>
                  </div>
                )}
                {scorePercentage >= 50 && scorePercentage < 80 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                      Khá tốt! Bạn có thể làm tốt hơn nữa.
                    </p>
                  </div>
                )}
                {scorePercentage < 50 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                    <p className="text-red-800 dark:text-red-300 font-semibold">
                      Cần cố gắng thêm. Hãy xem lại các câu sai bên dưới.
                    </p>
                  </div>
                )}
              </div>

              {/* Questions Review */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white">
                  Chi tiết kết quả
                </h3>

                {questions && questions.map((question, index) => {
                  const userAnswer = question.user_answer;
                  const isCorrect = userAnswer?.is_correct;
                  const userSelectedAnswerId = userAnswer?.answer_id;

                  return (
                    <div
                      key={question.question_id}
                      className={`bg-white dark:bg-background-dark border-2 rounded-xl p-6 ${
                        isCorrect
                          ? 'border-green-500'
                          : userAnswer
                          ? 'border-red-500'
                          : 'border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              Câu {index + 1}
                            </span>
                            {isCorrect && (
                              <span className="text-green-600 dark:text-green-400 font-semibold">
                                ✓ Đúng
                              </span>
                            )}
                            {!isCorrect && userAnswer && (
                              <span className="text-red-600 dark:text-red-400 font-semibold">
                                ✗ Sai
                              </span>
                            )}
                            {!userAnswer && (
                              <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                - Chưa trả lời
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-[#111418] dark:text-white">
                            {question.content}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Điểm: {userAnswer?.points_earned || 0}/{question.points}
                          </p>
                        </div>
                      </div>

                      {question.image_url && (
                        <div className="mb-4">
                          <img
                            src={question.image_url}
                            alt="Question"
                            className="max-w-md rounded-lg"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {question.answers && question.answers.map((answer) => {
                          const isUserSelected = answer.answer_id === userSelectedAnswerId;
                          const isCorrectAnswer = answer.is_correct;

                          return (
                            <div
                              key={answer.answer_id}
                              className={`p-4 rounded-lg border-2 ${
                                isCorrectAnswer
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : isUserSelected
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[#111418] dark:text-white">
                                  {answer.content}
                                </span>
                                <div className="flex items-center gap-2">
                                  {isUserSelected && (
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                      Bạn đã chọn
                                    </span>
                                  )}
                                  {isCorrectAnswer && (
                                    <span className="text-green-600 dark:text-green-400 font-semibold text-xl">
                                      ✓
                                    </span>
                                  )}
                                  {isUserSelected && !isCorrectAnswer && (
                                    <span className="text-red-600 dark:text-red-400 font-semibold text-xl">
                                      ✗
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attempt Info */}
              {max_attempts && (
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-semibold">Số lần đã làm:</span> {user_attempts_count}
                    {max_attempts && ` / ${max_attempts}`}
                    {!max_attempts && ' (không giới hạn)'}
                  </p>
                  {!can_retake && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      Bạn đã hết lượt làm bài cho quiz này!
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                {can_retake && (
                  <Button
                    onClick={() => navigate(`/student/quiz/${attempt.quiz_id}/take`)}
                    className="flex-1"
                  >
                    Làm lại
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/student/results')}
                  className={can_retake ? '' : 'flex-1'}
                  variant={can_retake ? 'secondary' : 'primary'}
                >
                  Xem danh sách kết quả
                </Button>
                <Button onClick={() => navigate('/student/dashboard')} variant="secondary">
                  Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizResultPage;
