import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/student/StudentSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import { studentAPI, commonAPI } from '../../services/api.js';

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    subject_id: '',
    difficulty_level: 'medium',
    access_level: 'public',
    result_mode: 'exam',
  });

  const [questions, setQuestions] = useState([
    {
      content: '',
      points: 1,
      answers: [
        { content: '', is_correct: false },
        { content: '', is_correct: false },
        { content: '', is_correct: false },
        { content: '', is_correct: false },
      ],
    },
  ]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await commonAPI.getSubjects();
      setSubjects(response.data.result || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách môn học:', error);
    }
  };

  const handleQuizChange = (field, value) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'is_correct' && value) {
      // Uncheck other answers when one is marked correct
      updatedQuestions[questionIndex].answers.forEach((ans, idx) => {
        ans.is_correct = idx === answerIndex;
      });
    } else {
      updatedQuestions[questionIndex].answers[answerIndex][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: '',
        points: 1,
        answers: [
          { content: '', is_correct: false },
          { content: '', is_correct: false },
          { content: '', is_correct: false },
          { content: '', is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!quizData.title || !quizData.subject_id) {
      alert('Vui lòng nhập tên quiz và chọn môn học');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].content) {
        alert(`Câu hỏi ${i + 1} chưa có nội dung`);
        return;
      }

      const hasCorrectAnswer = questions[i].answers.some((ans) => ans.is_correct);
      if (!hasCorrectAnswer) {
        alert(`Câu hỏi ${i + 1} chưa có đáp án đúng`);
        return;
      }

      const hasEmptyAnswer = questions[i].answers.some((ans) => !ans.content);
      if (hasEmptyAnswer) {
        alert(`Câu hỏi ${i + 1} có đáp án trống`);
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        ...quizData,
        questions,
      };

      const response = await studentAPI.createQuiz(payload);

      if (response.data.wasSuccessful) {
        alert('Tạo quiz thành công!');
        navigate('/student/my-quizzes');
      } else {
        alert(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi khi tạo quiz:', error);
      alert('Có lỗi xảy ra khi tạo quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        <StudentSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-10 py-3 bg-white dark:bg-background-dark">
            <h1 className="text-[#111418] dark:text-white text-xl font-bold">Tạo Quiz Mới</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Quay lại
            </button>
          </header>

          <div className="flex-1 p-10 overflow-y-auto">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
              {/* Quiz Information */}
              <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">
                  Thông tin Quiz
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tên Quiz <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={quizData.title}
                      onChange={(e) => handleQuizChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      placeholder="Nhập tên quiz"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={quizData.description}
                      onChange={(e) => handleQuizChange('description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      placeholder="Mô tả ngắn về quiz"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Môn học <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={quizData.subject_id}
                        onChange={(e) => handleQuizChange('subject_id', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">Chọn môn học</option>
                        {subjects.map((subject) => (
                          <option key={subject.subject_id} value={subject.subject_id}>
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Độ khó
                      </label>
                      <select
                        value={quizData.difficulty_level}
                        onChange={(e) => handleQuizChange('difficulty_level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      >
                        <option value="easy">Dễ</option>
                        <option value="medium">Trung bình</option>
                        <option value="hard">Khó</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chế độ làm bài
                      </label>
                      <select
                        value={quizData.result_mode}
                        onChange={(e) => handleQuizChange('result_mode', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      >
                        <option value="practice">Luyện tập (Hiển thị kết quả ngay)</option>
                        <option value="exam">Thi (Hiển thị kết quả sau khi nộp)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quyền truy cập
                      </label>
                      <select
                        value={quizData.access_level}
                        onChange={(e) => handleQuizChange('access_level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                    Câu hỏi ({questions.length})
                  </h2>
                  <Button type="button" onClick={addQuestion}>
                    + Thêm câu hỏi
                  </Button>
                </div>

                {questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#111418] dark:text-white">
                        Câu hỏi {qIndex + 1}
                      </h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Xóa câu hỏi
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nội dung câu hỏi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={question.content}
                          onChange={(e) => handleQuestionChange(qIndex, 'content', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                          placeholder="Nhập nội dung câu hỏi"
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Điểm
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, 'points', parseInt(e.target.value))
                          }
                          className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Đáp án
                        </label>
                        <div className="space-y-2">
                          {question.answers.map((answer, aIndex) => (
                            <div key={aIndex} className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={answer.is_correct}
                                onChange={() =>
                                  handleAnswerChange(qIndex, aIndex, 'is_correct', true)
                                }
                                className="w-4 h-4 text-primary"
                              />
                              <input
                                type="text"
                                value={answer.content}
                                onChange={(e) =>
                                  handleAnswerChange(qIndex, aIndex, 'content', e.target.value)
                                }
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                                placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`}
                                required
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Chọn radio button để đánh dấu đáp án đúng
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Tạo Quiz'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateQuizPage;
