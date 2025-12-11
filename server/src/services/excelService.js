import ExcelJS from "exceljs";
import {QuizModel} from "../models/Quiz.js";
import {QuestionModel} from "../models/Question.js";
import {AnswerModel} from "../models/Answer.js";
import {pool} from "../config/database.js";

export const excelService = {
  // Import quiz từ Excel
  async importQuizFromExcel(file, userId) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(file.path);
      
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        return {
          wasSuccessful: false,
          message: "File Excel không hợp lệ",
        };
      }

      const quizData = {
        questions: [],
      };

      // Đọc thông tin quiz từ sheet đầu tiên
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const question = {
          content: row.getCell(1).value,
          image_url: row.getCell(2).value || null,
          points: parseFloat(row.getCell(3).value) || 1,
          time_limit: parseInt(row.getCell(4).value) || 15,
          answers: [],
        };

        // Đọc 4 đáp án
        for (let i = 0; i < 4; i++) {
          const answerContent = row.getCell(5 + i * 2).value;
          const isCorrect = row.getCell(6 + i * 2).value;

          if (answerContent) {
            question.answers.push({
              content: answerContent,
              is_correct: isCorrect === true || isCorrect === "TRUE" || isCorrect === 1,
            });
          }
        }

        if (question.content) {
          quizData.questions.push(question);
        }
      });

      return {
        wasSuccessful: true,
        message: `Import thành công ${quizData.questions.length} câu hỏi`,
        result: quizData,
      };
    } catch (error) {
      console.error(error);
      return {
        wasSuccessful: false,
        message: "Lỗi khi đọc file Excel: " + error.message,
      };
    }
  },

  // Export quiz ra Excel
  async exportQuizToExcel(quizId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      const questions = await QuestionModel.findByQuiz(quizId);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Quiz Questions");

      // Header
      worksheet.columns = [
        { header: "Câu hỏi", key: "question", width: 50 },
        { header: "Hình ảnh URL", key: "image_url", width: 30 },
        { header: "Điểm", key: "points", width: 10 },
        { header: "Thời gian (giây)", key: "time_limit", width: 15 },
        { header: "Đáp án A", key: "answer_a", width: 30 },
        { header: "Đúng A", key: "correct_a", width: 10 },
        { header: "Đáp án B", key: "answer_b", width: 30 },
        { header: "Đúng B", key: "correct_b", width: 10 },
        { header: "Đáp án C", key: "answer_c", width: 30 },
        { header: "Đúng C", key: "correct_c", width: 10 },
        { header: "Đáp án D", key: "answer_d", width: 30 },
        { header: "Đúng D", key: "correct_d", width: 10 },
      ];

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

      // Add data
      for (const question of questions) {
        const answers = await AnswerModel.findByQuestion(question.question_id);
        
        const row = {
          question: question.content,
          image_url: question.image_url || "",
          points: question.points,
          time_limit: question.time_limit,
        };

        answers.forEach((answer, index) => {
          const letter = String.fromCharCode(97 + index); // a, b, c, d
          row[`answer_${letter}`] = answer.content;
          row[`correct_${letter}`] = answer.is_correct ? "TRUE" : "FALSE";
        });

        worksheet.addRow(row);
      }

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        column.alignment = { vertical: "middle", wrapText: true };
      });

      const buffer = await workbook.xlsx.writeBuffer();

      return {
        wasSuccessful: true,
        message: "Export quiz thành công",
        result: {
          buffer,
          filename: `quiz_${quizId}_${Date.now()}.xlsx`,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Export kết quả quiz ra Excel
  async exportQuizResultsToExcel(quizId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      const results = await pool.query(`
        SELECT 
          u.user_name,
          u.email,
          qa.attempt_number,
          qa.start_time,
          qa.end_time,
          qa.total_score,
          qa.status,
          EXTRACT(EPOCH FROM (qa.end_time - qa.start_time))/60 as time_taken_minutes
        FROM quiz_attempts qa
        JOIN users u ON qa.user_id = u.user_id
        WHERE qa.quiz_id = $1
        ORDER BY qa.total_score DESC, qa.end_time ASC
      `, [quizId]);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Quiz Results");

      // Header
      worksheet.columns = [
        { header: "Họ tên", key: "user_name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Lần thử", key: "attempt_number", width: 10 },
        { header: "Thời gian bắt đầu", key: "start_time", width: 20 },
        { header: "Thời gian kết thúc", key: "end_time", width: 20 },
        { header: "Điểm", key: "total_score", width: 10 },
        { header: "Thời gian làm bài (phút)", key: "time_taken_minutes", width: 20 },
        { header: "Trạng thái", key: "status", width: 15 },
      ];

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF70AD47" },
      };
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

      // Add data
      results.rows.forEach((result) => {
        worksheet.addRow({
          user_name: result.user_name,
          email: result.email,
          attempt_number: result.attempt_number,
          start_time: result.start_time,
          end_time: result.end_time,
          total_score: result.total_score,
          time_taken_minutes: result.time_taken_minutes ? parseFloat(result.time_taken_minutes).toFixed(2) : "N/A",
          status: result.status,
        });
      });

      // Add summary row
      worksheet.addRow({});
      const summaryRow = worksheet.addRow({
        user_name: "Tổng kết",
        email: `Tổng số: ${results.rows.length} lượt làm bài`,
        total_score: `TB: ${(results.rows.reduce((sum, r) => sum + parseFloat(r.total_score || 0), 0) / results.rows.length).toFixed(2)}`,
      });
      summaryRow.font = { bold: true };
      summaryRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };

      const buffer = await workbook.xlsx.writeBuffer();

      return {
        wasSuccessful: true,
        message: "Export kết quả thành công",
        result: {
          buffer,
          filename: `quiz_results_${quizId}_${Date.now()}.xlsx`,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Export danh sách học sinh trong class
  async exportClassStudentsToExcel(classId) {
    try {
      const classData = await pool.query(`
        SELECT c.*, s.subject_name, u.user_name as teacher_name
        FROM classes c
        LEFT JOIN subjects s ON c.subject_id = s.subject_id
        LEFT JOIN users u ON c.teacher_id = u.user_id
        WHERE c.class_id = $1
      `, [classId]);

      if (classData.rows.length === 0) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      const students = await pool.query(`
        SELECT 
          u.user_name,
          u.email,
          cm.joined_at,
          cm.status,
          COUNT(DISTINCT qa.quiz_id) as completed_quizzes,
          AVG(qa.total_score) as average_score
        FROM class_members cm
        JOIN users u ON cm.user_id = u.user_id
        LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
        LEFT JOIN class_quizzes cq ON qa.quiz_id = cq.quiz_id AND cq.class_id = $1
        WHERE cm.class_id = $1
        GROUP BY u.user_id, u.user_name, u.email, cm.joined_at, cm.status
        ORDER BY u.user_name
      `, [classId]);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Class Students");

      // Thông tin lớp học
      worksheet.addRow(["Tên lớp:", classData.rows[0].class_name]);
      worksheet.addRow(["Mã lớp:", classData.rows[0].class_code]);
      worksheet.addRow(["Môn học:", classData.rows[0].subject_name]);
      worksheet.addRow(["Giáo viên:", classData.rows[0].teacher_name]);
      worksheet.addRow([]);

      // Header
      const headerRow = worksheet.addRow([
        "STT",
        "Họ tên",
        "Email",
        "Ngày tham gia",
        "Trạng thái",
        "Số quiz hoàn thành",
        "Điểm trung bình",
      ]);
      
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };

      // Add students
      students.rows.forEach((student, index) => {
        worksheet.addRow([
          index + 1,
          student.user_name,
          student.email,
          student.joined_at,
          student.status,
          student.completed_quizzes || 0,
          student.average_score ? parseFloat(student.average_score).toFixed(2) : "N/A",
        ]);
      });

      // Auto-fit columns
      worksheet.columns = [
        { width: 10 },
        { width: 25 },
        { width: 30 },
        { width: 20 },
        { width: 15 },
        { width: 20 },
        { width: 20 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();

      return {
        wasSuccessful: true,
        message: "Export danh sách học sinh thành công",
        result: {
          buffer,
          filename: `class_students_${classId}_${Date.now()}.xlsx`,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Template Excel để import quiz
  async generateQuizTemplate() {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Quiz Template");

      // Header
      worksheet.columns = [
        { header: "Câu hỏi", key: "question", width: 50 },
        { header: "Hình ảnh URL", key: "image_url", width: 30 },
        { header: "Điểm", key: "points", width: 10 },
        { header: "Thời gian (giây)", key: "time_limit", width: 15 },
        { header: "Đáp án A", key: "answer_a", width: 30 },
        { header: "Đúng A (TRUE/FALSE)", key: "correct_a", width: 20 },
        { header: "Đáp án B", key: "answer_b", width: 30 },
        { header: "Đúng B (TRUE/FALSE)", key: "correct_b", width: 20 },
        { header: "Đáp án C", key: "answer_c", width: 30 },
        { header: "Đúng C (TRUE/FALSE)", key: "correct_c", width: 20 },
        { header: "Đáp án D", key: "answer_d", width: 30 },
        { header: "Đúng D (TRUE/FALSE)", key: "correct_d", width: 20 },
      ];

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

      // Add example row
      worksheet.addRow({
        question: "Câu hỏi mẫu: 2 + 2 = ?",
        image_url: "",
        points: 1,
        time_limit: 15,
        answer_a: "3",
        correct_a: "FALSE",
        answer_b: "4",
        correct_b: "TRUE",
        answer_c: "5",
        correct_c: "FALSE",
        answer_d: "6",
        correct_d: "FALSE",
      });

      const buffer = await workbook.xlsx.writeBuffer();

      return {
        wasSuccessful: true,
        message: "Tạo template thành công",
        result: {
          buffer,
          filename: `quiz_template_${Date.now()}.xlsx`,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};