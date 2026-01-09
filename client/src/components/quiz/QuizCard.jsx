import React from 'react';
import PropTypes from 'prop-types';

const QuizCard = ({ quiz, variant = 'standard', onClick }) => {
  // Helper functions
  const getDifficultyBadge = (level) => {
    const badges = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    const labels = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[level]}`}>
        {labels[level]}
      </span>
    );
  };

  const getStatusBadge = (completed, isCreatedQuiz = false) => {
    if (isCreatedQuiz) {
      return quiz.status === 'published' ? (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
          Đã xuất bản
        </span>
      ) : (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400">
          Nháp
        </span>
      );
    }

    return completed ? (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
        Đã làm
      </span>
    ) : (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400">
        Chưa làm
      </span>
    );
  };

  // Variant: standard (HomePage, QuizLibrary)
  if (variant === 'standard') {
    return (
      <div
        onClick={onClick}
        className="bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
      >
        {/* Cover Image */}
        {quiz.cover_image_url ? (
          <div className="h-40 overflow-hidden bg-gray-200">
            <img
              src={quiz.cover_image_url}
              alt={quiz.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
            {quiz.title}
          </h3>

          {quiz.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
              {quiz.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {quiz.difficulty_level && getDifficultyBadge(quiz.difficulty_level)}
            {quiz.subject_name && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                {quiz.subject_name}
              </span>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-white/10 pt-3">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{quiz.attempt_count || 0} lượt làm</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>{quiz.total_score} điểm</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant: assigned (Dashboard, ClassDetail - Quiz được giao)
  if (variant === 'assigned') {
    return (
      <div
        onClick={onClick}
        className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
          {quiz.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {quiz.question_count} câu hỏi {quiz.class_name && `• ${quiz.class_name}`}
        </p>

        {/* Score if completed */}
        {quiz.completed && quiz.score !== null && quiz.total_score && (
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
            Điểm: {quiz.score}/{quiz.total_score}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            {getStatusBadge(quiz.completed)}
            {quiz.completed && quiz.score !== null && quiz.total_score && (
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {((quiz.score / quiz.total_score) * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Due date */}
        {quiz.due_date && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Hạn: {new Date(quiz.due_date).toLocaleDateString('vi-VN')}
          </p>
        )}

        {/* Completed date */}
        {quiz.completed && quiz.completed_at && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Hoàn thành: {new Date(quiz.completed_at).toLocaleDateString('vi-VN')}
          </p>
        )}
      </div>
    );
  }

  // Variant: compact (MyQuizzes - Quiz tôi tạo)
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
          {quiz.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {quiz.question_count} câu hỏi {quiz.subject_name && `• ${quiz.subject_name}`}
        </p>

        <div className="flex items-center justify-between">
          {getStatusBadge(false, true)}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {quiz.total_attempts || quiz.attempt_count || 0} lượt làm
          </span>
        </div>
      </div>
    );
  }

  return null;
};

QuizCard.propTypes = {
  quiz: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(['standard', 'assigned', 'compact']),
  onClick: PropTypes.func,
};

export default QuizCard;
