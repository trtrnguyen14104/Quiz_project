import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/dashboard/teacher/TeacherSidebar.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { teacherAPI } from '../../services/api.js';

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [classes, setClasses] = useState([]);
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: '',
    timeLimit: 30,
  });
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      questionType: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
    },
  ]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await teacherAPI.getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Lỗi khi tải lớp học:', error);
    }
  };

  const handleQuizChange = (field, value) => {
    setQuiz({ ...quiz, [field]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1,
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

    try {
      const quizData = {
        ...quiz,
        questions: questions.map((q) => ({
          ...q,
          options: JSON.stringify(q.options),
        })),
      };

      await teacherAPI.createQuiz(quizData);
      alert('Tạo quiz thành công!');
      navigate('/teacher/quizzes');
    } catch (error) {
      console.error('Lỗi khi tạo quiz:', error);
      alert('Không thể tạo quiz. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex min-h-screen">
        <TeacherSidebar user={user} />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-[#18232f] sticky top-0 z-10">
            <h1 className="text-[#111418] dark:text-white text-lg font-bold">Tạo Quiz Mới</h1>
          </header>

          <div className="flex-1 p-10">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
              {/* Quiz Information */}
              <div className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-6">
                  Thông tin Quiz
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Tên Quiz"
                    type="text"
                    value={quiz.title}
                    onChange={(e) => handleQuizChange('title', e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={quiz.description}
                      onChange={(e) => handleQuizChange('description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                      Lớp học *
                    </label>
                    <select
                      value={quiz.classId}
                      onChange={(e) => handleQuizChange('classId', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Chọn lớp học</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Thời hạn (phút)"
                      type="number"
                      value={quiz.timeLimit}
                      onChange={(e) => handleQuizChange('timeLimit', parseInt(e.target.value))}
                      min={1}
                    />

                    <Input
                      label="Ngày hết hạn"
                      type="datetime-local"
                      value={quiz.dueDate}
                      onChange={(e) => handleQuizChange('dueDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                    Câu hỏi ({questions.length})
                  </h2>
                  <Button type="button" onClick={addQuestion}>
                    Thêm câu hỏi
                  </Button>
                </div>

                {questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="bg-white dark:bg-[#18232f] border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-[#111418] dark:text-white">
                        Câu {qIndex + 1}
                      </h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Câu hỏi"
                        type="text"
                        value={question.questionText}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, 'questionText', e.target.value)
                        }
                        required
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                            Loại câu hỏi
                          </label>
                          <select
                            value={question.questionType}
                            onChange={(e) =>
                              handleQuestionChange(qIndex, 'questionType', e.target.value)
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="multiple_choice">Trắc nghiệm</option>
                            <option value="true_false">Đúng/Sai</option>
                          </select>
                        </div>

                        <Input
                          label="Điểm"
                          type="number"
                          value={question.points}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, 'points', parseInt(e.target.value))
                          }
                          min={1}
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#111418] dark:text-white">
                          Đáp án
                        </label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex gap-2 items-center">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() =>
                                handleQuestionChange(qIndex, 'correctAnswer', oIndex)
                              }
                              className="w-4 h-4 text-primary"
                            />
                            <Input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(qIndex, oIndex, e.target.value)
                              }
                              placeholder={`Đáp án ${oIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit">Tạo Quiz</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/teacher/quizzes')}
                >
                  Hủy
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
