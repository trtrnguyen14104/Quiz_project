### 1. Cài Đặt Backend
```bash
cd server
npm install
```

### 2. Cấu Hình Database

**Tạo database PostgreSQL trong pgadmin4:**

**Tên database: quiz_project**

**Chạy migration để tạo tables:**
```bash
cd server
./database/db_init.sh
```
### 3. Seed dữ liệu

**Seed dữ liệu mẫu ở 'Quiz_project/server/database/seeds/001_seed_data.sql' vào pgadmin:**

### 4. Cài Đặt Frontend

```bash
cd client
npm install
```
## Chạy Ứng Dụng ở local

**Terminal 1 - Chạy Backend:**
```bash
cd server
npm run dev
```
Backend sẽ chạy tại: `http://localhost:5000`

**Terminal 2 - Chạy Frontend:**
```bash
cd client
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

## Tài Khoản Mặc Định (Sau Khi Seed Data)

**Quản trị viên:**
- Email: admin@quiz.com
- Password: 123456

**Giáo viên:**
- Email: huong.teacher@quiz.com
- Password: 123456

**Học sinh (ví dụ):**
- Email: an.student@quiz.com
- Password: 123456


