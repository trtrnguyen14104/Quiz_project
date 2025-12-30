import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { studentAPI } from '../../services/api.js';

const QuizTakingPage = () => {
  const { quiz_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answerFeedback, setAnswerFeedback] = useState({}); // For practice mode
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [attemptId, setAttemptId] = useState(null);

  useEffect(() => {
    fetchQuizDetail();
  }, [quiz_id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuizDetail = async () => {
    try {
      const response = await studentAPI.getQuizWithQuestions(quiz_id);
      const quizData = response.data.result;

      setQuiz(quizData);

      if (quizData.time_limit) {
        setTimeLeft(quizData.time_limit * 60); // Convert to seconds
      }

      // Start attempt
      const attemptResponse = await studentAPI.startAttempt(quiz_id);
      if (attemptResponse.data.wasSuccessful) {
        setAttemptId(attemptResponse.data.result.attempt_id);
      } else {
        alert(attemptResponse.data.message);
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('Lỗi khi tải quiz:', error);
      alert('Không thể tải quiz. Vui lòng thử lại.');
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = async (questionId, answerIndex) => {
    if (!attemptId) {
      alert('Chưa khởi tạo attempt. Vui lòng thử lại.');
      return;
    }

    const newAnswers = { ...answers, [questionId]: answerIndex };
    setAnswers(newAnswers);

    try {
      // Lấy answer_id từ answerIndex
      const currentQ = quiz.questions.find(q => q.question_id === questionId);
      const selectedAnswer = currentQ.answers[answerIndex];

      // Submit answer to backend
      const response = await studentAPI.submitAnswer(attemptId, {
        question_id: questionId,
        answer_id: selectedAnswer.answer_id,
        time_taken: 0 // TODO: Track actual time
      });

      // Practice mode: Show feedback immediately
      if (quiz.result_mode === 'practice' && response.data.result?.is_correct !== null) {
        const correctAnswerIndex = currentQ.answers.findIndex(a => a.is_correct);
        setAnswerFeedback({
          ...answerFeedback,
          [questionId]: {
            isCorrect: response.data.result.is_correct,
            correctAnswer: correctAnswerIndex,
            selectedAnswer: answerIndex
          }
        });
      }
    } catch (error) {
      console.error('Lỗi khi submit answer:', error);
      // Rollback UI if failed
      const rollbackAnswers = { ...answers };
      delete rollbackAnswers[questionId];
      setAnswers(rollbackAnswers);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Không thể lưu câu trả lời. Vui lòng thử lại.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) {
      alert('Chưa khởi tạo bài làm. Vui lòng thử lại.');
      return;
    }

    if (Object.keys(answers).length < quiz.questions.length) {
      if (!confirm('Bạn chưa trả lời hết các câu hỏi. Bạn có chắc muốn nộp bài?')) return;
    } else {
      if (!confirm('Bạn có chắc muốn nộp bài?')) return;
    }

    try {
      const response = await studentAPI.finishAttempt(attemptId);
      setSubmitted(true);

      if (response.data.wasSuccessful) {
        alert('Nộp bài thành công!');
        navigate(`/student/result/${attemptId}`);
      } else {
        alert(response.data.message || 'Không thể nộp bài.');
      }
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      alert('Không thể nộp bài. Vui lòng thử lại.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-gray-500 dark:text-gray-400">
          {!quiz ? 'Quiz không tồn tại' : 'Quiz chưa có câu hỏi'}
        </p>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const currentFeedback = answerFeedback[currentQ.question_id];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
            <div>
              <h1 className="text-[#111418] dark:text-white text-lg font-bold">{quiz.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chế độ: {quiz.result_mode === 'practice' ? 'Luyện tập' : 'Thi'}
              </p>
            </div>
            {timeLeft !== null && (
              <div className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-[#111418] dark:text-white'}`}>
                Thời gian còn lại: {formatTime(timeLeft)}
              </div>
            )}
          </header>

          <div className="flex-1 p-10">
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Câu {currentQuestion + 1} / {quiz.questions.length}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Đã trả lời: {Object.keys(answers).length} / {quiz.questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-8 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-[#111418] dark:text-white flex-1">
                    {currentQ.content}
                  </h2>
                  {currentQ.points && (
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-4">
                      {currentQ.points} điểm
                    </span>
                  )}
                </div>

                {/* Practice mode feedback */}
                {quiz.result_mode === 'practice' && currentFeedback && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    currentFeedback.isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    <p className={`font-semibold ${
                      currentFeedback.isCorrect
                        ? 'text-green-800 dark:text-green-300'
                        : 'text-red-800 dark:text-red-300'
                    }`}>
                      {currentFeedback.isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng'}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {currentQ.answers && currentQ.answers.map((answer, index) => {
                    const isSelected = answers[currentQ.question_id] === index;
                    const isCorrect = quiz.result_mode === 'practice' && currentFeedback && index === currentFeedback.correctAnswer;
                    const isWrong = quiz.result_mode === 'practice' && currentFeedback && isSelected && !currentFeedback.isCorrect;

                    return (
                      <label
                        key={index}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected && !currentFeedback
                            ? 'border-primary bg-primary/10'
                            : isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : isWrong
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQ.question_id}`}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentQ.question_id, index)}
                          disabled={quiz.result_mode === 'practice' && currentFeedback}
                          className="w-5 h-5 text-primary"
                        />
                        <span className="ml-3 text-[#111418] dark:text-white flex-1">
                          {answer.content}
                        </span>
                        {quiz.result_mode === 'practice' && isCorrect && (
                          <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
                        )}
                        {quiz.result_mode === 'practice' && isWrong && (
                          <span className="text-red-600 dark:text-red-400 font-semibold">✗</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Câu trước
                </Button>

                <div className="flex gap-2 overflow-x-auto max-w-md">
                  {quiz.questions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg font-medium flex-shrink-0 ${
                        index === currentQuestion
                          ? 'bg-primary text-white'
                          : answers[quiz.questions[index].question_id] !== undefined
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button onClick={handleSubmit}>Nộp bài</Button>
                ) : (
                  <Button
                    onClick={() =>
                      setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))
                    }
                  >
                    Câu tiếp theo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizTakingPage;
