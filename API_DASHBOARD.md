# Dashboard API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Tất cả các endpoint dashboard yêu cầu authentication token trong header:
```
Authorization: Bearer <token>
```

---

## 🎓 Student Dashboard API

### 1. Get Student Dashboard
Lấy thông tin tổng quan dashboard cho học sinh.

**Endpoint:** `GET /student/dashboard`

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy thông tin dashboard thành công",
  "result": {
    "statistics": {
      "total_classes": 3,
      "completed_quizzes": 5,
      "average_score": 85.5,
      "pending_quizzes": 2
    },
    "recent_attempts": [
      {
        "attempt_id": 1,
        "quiz_id": 1,
        "total_score": 8.5,
        "quiz_title": "Phương trình bậc 2",
        "subject_name": "Toán học",
        "class_name": "Toán 10A1",
        "end_time": "2024-01-15T10:30:00"
      }
    ],
    "classes": [
      {
        "class_id": 1,
        "class_name": "Toán 10A1",
        "class_code": "MATH01",
        "subject_name": "Toán học",
        "teacher_name": "Trần Thị Hương",
        "student_count": 25,
        "quiz_count": 5
      }
    ],
    "available_quizzes": [
      {
        "quiz_id": 1,
        "title": "Phương trình bậc 2",
        "quiz_code": "QZ0001",
        "difficulty_level": "medium",
        "subject_name": "Toán học",
        "class_name": "Toán 10A1",
        "question_count": 10,
        "due_date": "2024-02-01T23:59:59",
        "completed": false
      }
    ]
  }
}
```

### 2. Get Student Quizzes
Lấy danh sách quiz của học sinh với phân trang và bộ lọc.

**Endpoint:** `GET /student/quizzes`

**Query Parameters:**
- `page` (optional): Số trang, mặc định = 1
- `limit` (optional): Số item mỗi trang, mặc định = 20
- `status` (optional): Lọc theo trạng thái (`completed`, `pending`)

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy danh sách quiz thành công",
  "result": {
    "quizzes": [
      {
        "quiz_id": 1,
        "title": "Phương trình bậc 2",
        "quiz_code": "QZ0001",
        "difficulty_level": "medium",
        "subject_name": "Toán học",
        "class_name": "Toán 10A1",
        "question_count": 10,
        "completed": true,
        "score": 85.5,
        "due_date": "2024-02-01T23:59:59"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 15,
      "total_pages": 1
    }
  }
}
```

### 3. Get Student Results
Lấy danh sách kết quả làm bài của học sinh.

**Endpoint:** `GET /student/results`

**Query Parameters:**
- `page` (optional): Số trang, mặc định = 1
- `limit` (optional): Số item mỗi trang, mặc định = 20

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy danh sách kết quả thành công",
  "result": {
    "attempts": [
      {
        "attempt_id": 1,
        "quiz_id": 1,
        "quiz_title": "Phương trình bậc 2",
        "subject_name": "Toán học",
        "class_name": "Toán 10A1",
        "total_score": 8.5,
        "max_score": 10,
        "total_questions": 5,
        "correct_answers": 4,
        "start_time": "2024-01-15T10:00:00",
        "end_time": "2024-01-15T10:30:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 10,
      "total_pages": 1
    }
  }
}
```

### 4. Get Student Classes
Lấy danh sách lớp học của học sinh.

**Endpoint:** `GET /student/classes`

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy danh sách lớp học thành công",
  "result": [
    {
      "class_id": 1,
      "class_name": "Toán 10A1",
      "class_code": "MATH01",
      "description": "Lớp Toán 10 nâng cao",
      "subject_name": "Toán học",
      "teacher_name": "Trần Thị Hương",
      "teacher_email": "huong.teacher@quiz.com",
      "student_count": 25,
      "quiz_count": 5,
      "joined_at": "2024-01-01T00:00:00"
    }
  ]
}
```

---

## 👨‍🏫 Teacher Dashboard API

### 1. Get Teacher Dashboard
Lấy thông tin tổng quan dashboard cho giáo viên.

**Endpoint:** `GET /teacher/dashboard`

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy thông tin dashboard thành công",
  "result": {
    "stats": {
      "total_classes": 5,
      "total_students": 120,
      "active_quizzes": 15,
      "average_score": 78.5
    },
    "classes": [
      {
        "class_id": 1,
        "class_name": "Toán 10A1",
        "class_code": "MATH01",
        "subject_name": "Toán học",
        "student_count": 25,
        "quiz_count": 5,
        "score": 82.3,
        "created_at": "2024-01-01T00:00:00"
      }
    ],
    "quizzes": [
      {
        "quiz_id": 1,
        "title": "Phương trình bậc 2",
        "quiz_code": "QZ0001",
        "difficulty_level": "medium",
        "status": "published",
        "subject_name": "Toán học",
        "class_name": "Toán 10A1",
        "question_count": 10,
        "attempt_count": 23,
        "average_score": 85.5,
        "due_date": "2024-02-01T23:59:59"
      }
    ],
    "recent_attempts": [
      {
        "attempt_id": 1,
        "student_name": "Nguyễn Văn An",
        "quiz_title": "Phương trình bậc 2",
        "class_name": "Toán 10A1",
        "total_score": 9.0,
        "end_time": "2024-01-15T10:30:00"
      }
    ]
  }
}
```

### 2. Get Teacher Classes
Lấy danh sách lớp học do giáo viên quản lý.

**Endpoint:** `GET /teacher/classes`

**Query Parameters:**
- `page` (optional): Số trang, mặc định = 1
- `limit` (optional): Số item mỗi trang, mặc định = 20

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy danh sách lớp học thành công",
  "result": {
    "classes": [
      {
        "class_id": 1,
        "class_name": "Toán 10A1",
        "class_code": "MATH01",
        "description": "Lớp Toán 10 nâng cao",
        "subject_name": "Toán học",
        "status": "active",
        "student_count": 25,
        "quiz_count": 5,
        "score": 82.3,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-15T00:00:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### 3. Get Teacher Quizzes
Lấy danh sách quiz do giáo viên tạo.

**Endpoint:** `GET /teacher/quizzes`

**Query Parameters:**
- `page` (optional): Số trang, mặc định = 1
- `limit` (optional): Số item mỗi trang, mặc định = 20
- `status` (optional): Lọc theo trạng thái (`draft`, `published`, `archived`)

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy danh sách quiz thành công",
  "result": {
    "quizzes": [
      {
        "quiz_id": 1,
        "title": "Phương trình bậc 2",
        "quiz_code": "QZ0001",
        "difficulty_level": "medium",
        "status": "published",
        "access_level": "class",
        "subject_name": "Toán học",
        "topic_name": "Đại số",
        "class_name": "Toán 10A1",
        "question_count": 10,
        "attempt_count": 23,
        "average_score": 85.5,
        "created_at": "2024-01-01T00:00:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 15,
      "total_pages": 1
    }
  }
}
```

### 4. Get Teacher Statistics
Lấy thống kê chi tiết cho giáo viên.

**Endpoint:** `GET /teacher/statistics`

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy thống kê thành công",
  "result": {
    "overall": {
      "total_classes": 5,
      "total_quizzes": 15,
      "total_students": 120,
      "total_attempts": 450,
      "overall_average_score": 78.5
    },
    "class_performance": [
      {
        "class_id": 1,
        "class_name": "Toán 10A1",
        "student_count": 25,
        "average_score": 82.3
      }
    ],
    "quiz_performance": [
      {
        "quiz_id": 1,
        "title": "Phương trình bậc 2",
        "difficulty_level": "medium",
        "attempt_count": 23,
        "average_score": 85.5,
        "highest_score": 100,
        "lowest_score": 60
      }
    ]
  }
}
```

---

## 👑 Admin Dashboard API

### Get Admin Dashboard
Lấy thông tin tổng quan dashboard cho admin.

**Endpoint:** `GET /admin/dashboard`

**Response:**
```json
{
  "wasSuccessful": true,
  "message": "Lấy thông tin dashboard thành công",
  "result": {
    "statistics": {
      "total_users": 150,
      "total_quizzes": 45,
      "total_classes": 12,
      "total_attempts": 1500,
      "new_users_this_month": 25,
      "attempts_this_month": 350
    },
    "recent_activities": [
      {
        "log_id": 1,
        "user_id": 5,
        "action": "LOGIN",
        "description": "User logged in",
        "created_at": "2024-01-15T10:30:00"
      }
    ],
    "popular_quizzes": [
      {
        "quiz_id": 1,
        "title": "Phương trình bậc 2",
        "attempt_count": 50
      }
    ]
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Token không được cung cấp"
}
```

### 403 Forbidden
```json
{
  "error": "Không có quyền truy cập chức năng này"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Sử dụng với Frontend

### Frontend API Calls (client/src/services/api.js)

```javascript
// Student Dashboard
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getQuizzes: (params) => api.get('/student/quizzes', { params }),
  getResults: (params) => api.get('/student/results', { params }),
  getClasses: () => api.get('/student/classes'),
};

// Teacher Dashboard
export const teacherAPI = {
  getDashboard: () => api.get('/teacher/dashboard'),
  getClasses: (params) => api.get('/teacher/classes', { params }),
  getQuizzes: (params) => api.get('/teacher/quizzes', { params }),
  getStatistics: () => api.get('/teacher/statistics'),
};

// Admin Dashboard
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  // ... other admin endpoints
};
```

### React Component Example

```jsx
import { useEffect, useState } from 'react';
import { studentAPI } from '../services/api';

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await studentAPI.getDashboard();
        setDashboard(response.data.result);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Student Dashboard</h1>
      <div>Total Classes: {dashboard.statistics.total_classes}</div>
      {/* ... */}
    </div>
  );
}
```
