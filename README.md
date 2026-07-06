# Todo App - Ứng dụng Quản lý công việc

Bài test Intern Developer. Ứng dụng CRUD quản lý công việc với tìm kiếm, lọc theo trạng thái, phân trang và sắp xếp.

## Tech stack

| Layer    | Công nghệ |
|----------|-----------|
| Backend  | Java 17, Spring Boot 3, Spring Data JPA, Spring Validation, H2 Database |
| Frontend | React 18, Vite, Tailwind CSS |
| Testing  | JUnit 5, Mockito, MockMvc |
| Khác     | Docker, Docker Compose |

## Tính năng

- Hiển thị danh sách công việc (phân trang, sắp xếp theo ngày tạo / tiêu đề / độ ưu tiên).
- Thêm / sửa / xóa công việc.
- Đánh dấu hoàn thành / chưa hoàn thành (checkbox).
- Tìm kiếm theo từ khóa (tiêu đề + mô tả) và lọc theo trạng thái.
- Validate dữ liệu đầu vào ở cả frontend và backend (tiêu đề bắt buộc, giới hạn độ dài...).
- Xử lý lỗi tập trung (404, 400 validation, 500) trả về JSON có cấu trúc rõ ràng.
- Unit test & integration test cho backend.

## Cấu trúc thư mục

```
todo-app/
├── backend/                # Spring Boot REST API
│   ├── src/main/java/com/todoapp/
│   │   ├── controller/     # REST controller
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Spring Data JPA
│   │   ├── model/          # Entity
│   │   ├── dto/            # Request/Response DTO
│   │   ├── exception/      # Custom exception + Global handler
│   │   └── config/         # CORS config
│   └── src/test/java/...   # Unit + Integration tests
├── frontend/                # React (Vite) SPA
│   └── src/
│       ├── api/            # Gọi API backend
│       ├── components/     # TodoForm, TodoList, TodoItem, FilterBar, Pagination
|       ├── hook/
│       └── App.jsx
└── docker-compose.yml
```

## Cách chạy dự án

### Cách 1: Chạy bằng Docker (khuyến nghị - nhanh nhất)

Yêu cầu: đã cài Docker & Docker Compose.

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/todos

### Cách 2: Chạy thủ công (development)

**Backend** (yêu cầu Java 17 + Maven):

```bash
cd backend
mvn spring-boot:run
```

Backend chạy tại `http://localhost:8080`. Dữ liệu lưu trong H2 file database tại `backend/data/`.
Có thể xem trực tiếp database qua H2 Console: `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:file:./data/tododb`, user: `sa`, password: để trống).

**Frontend** (yêu cầu Node.js 18+):

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173` và tự động proxy các request `/api` sang `http://localhost:8080` (cấu hình trong `vite.config.js`).

## Chạy Unit Test

```bash
cd backend
mvn test
```

Bao gồm:
- `TodoServiceTest`: test business logic (mock repository) — validate default priority, clamp phân trang không hợp lệ, toggle trạng thái, xử lý lỗi not-found.
- `TodoControllerTest`: integration test qua MockMvc với H2 in-memory riêng cho test (profile `test`) — test các endpoint CRUD, validate lỗi 400/404.

## API Endpoints

| Method | Endpoint                    | Mô tả |
|--------|------------------------------|-------|
| GET    | `/api/todos`                 | Danh sách công việc (query: `keyword`, `completed`, `page`, `size`, `sortBy`, `direction`) |
| GET    | `/api/todos/{id}`             | Chi tiết 1 công việc |
| POST   | `/api/todos`                  | Tạo công việc mới |
| PUT    | `/api/todos/{id}`             | Cập nhật công việc |
| PATCH  | `/api/todos/{id}/toggle`      | Đảo trạng thái hoàn thành |
| DELETE | `/api/todos/{id}`             | Xóa công việc |

Ví dụ: `GET /api/todos?keyword=hoc&completed=false&page=0&size=10&sortBy=createdAt&direction=desc`

## Các điểm xử lý tình huống phát sinh (edge cases)

- Tiêu đề rỗng/khoảng trắng → 400 với message rõ ràng (validate cả 2 phía).
- `page`/`size` không hợp lệ (âm, quá lớn) → tự động clamp về giá trị an toàn thay vì lỗi 500.
- `sortBy` không nằm trong danh sách cho phép → fallback về `createdAt` để tránh lỗi SQL injection qua field name.
- Xóa/sửa công việc không tồn tại → 404 thay vì exception thô.
- Từ khóa tìm kiếm rỗng/khoảng trắng → được chuẩn hóa để trả về toàn bộ danh sách thay vì rỗng.
- Debounce 400ms khi gõ tìm kiếm ở frontend để tránh gọi API liên tục.

## Điểm có thể mở rộng thêm

- Thêm phân quyền người dùng (mỗi user chỉ thấy todo của mình).
- Thêm due date + nhắc hạn.
- Deploy backend lên Render/Railway, frontend lên Vercel/Netlify.
- Thêm CI (GitHub Actions) chạy test tự động khi push.
