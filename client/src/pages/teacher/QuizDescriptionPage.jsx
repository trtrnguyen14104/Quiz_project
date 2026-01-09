import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/dashboard/teacher/TeacherSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { teacherAPI } from '../../services/api.js';

const QuizDescriptionPage = () => {
  const { quiz_id } = useParams();
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizDetail();
  }, [quiz_id]);

  const fetchQuizDetail = async () => {
    try {
      const response = await teacherAPI.getQuizWithQuestions(quiz_id);
      if (response.data.wasSuccessful) {
        setQuiz(response.data.result);
      }
    } catch (error) {
      console.error('Lỗi khi tải quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quiz này?')) {
      return;
    }

    try {
      await teacherAPI.deleteQuiz(quiz_id);
      alert('Xóa quiz thành công!');
      navigate('/teacher/quizzes');
    } catch (error) {
      console.error('Lỗi khi xóa quiz:', error);
      alert('Không thể xóa quiz. Vui lòng thử lại.');
    }
  };

  const getDifficultyBadge = (level) => {
    const styles = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
    };
    return styles[level] || styles.medium;
  };

  const getDifficultyText = (level) => {
    const text = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
    };
    return text[level] || 'Trung bình';
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
        <p className="text-gray-500">Quiz không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <TeacherSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark">
            <h1 className="text-[#111418] dark:text-white text-xl font-bold">Chi tiết Quiz</h1>
            <div className="flex items-center gap-3">
              {quiz && quiz.creator_id === user?.user_id && (
                <>
                  <Button variant="secondary" onClick={() => navigate(`/teacher/quiz/${quiz_id}/edit`)}>
                    Sửa Quiz
                  </Button>
                  <button
                    onClick={handleDeleteQuiz}
                    className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
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

          <div className="flex-1 p-10 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Quiz Info Card */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
                      {quiz.title}
                    </h2>
                    {quiz.description && (
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{quiz.description}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyBadge(
                      quiz.difficulty_level
                    )}`}
                  >
                    {getDifficultyText(quiz.difficulty_level)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Số câu hỏi</p>
                      <p className="text-xl font-bold text-[#111418] dark:text-white">
                        {quiz.questions?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tổng điểm</p>
                      <p className="text-xl font-bold text-[#111418] dark:text-white">
                        {quiz.total_score || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600 dark:text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Chế độ</p>
                      <p className="text-xl font-bold text-[#111418] dark:text-white">
                        {quiz.result_mode === 'practice' ? 'Luyện tập' : 'Thi'}
                      </p>
                    </div>
                  </div>
                </div>

                {quiz.subject_name && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Môn học: <span className="font-medium text-gray-900 dark:text-white">{quiz.subject_name}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Questions Preview */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-8">
                <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-6">
                  Danh sách câu hỏi ({quiz.questions?.length || 0})
                </h3>

                {quiz.questions && quiz.questions.length > 0 ? (
                  <div className="space-y-6">
                    {quiz.questions.map((question, index) => (
                      <div
                        key={question.question_id}
                        className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-white font-medium mb-4">
                              {question.content}
                            </p>
                            <div className="space-y-2">
                              {question.answers?.map((answer, aIndex) => (
                                <div
                                  key={answer.answer_id}
                                  className={`p-3 rounded-lg border ${
                                    answer.is_correct
                                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700'
                                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                                      {String.fromCharCode(65 + aIndex)}
                                    </span>
                                    <p className={answer.is_correct ? 'text-green-900 dark:text-green-100 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                                      {answer.content}
                                    </p>
                                    {answer.is_correct && (
                                      <svg
                                        className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                              Điểm: {question.points}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Quiz chưa có câu hỏi nào
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizDescriptionPage;
