# Dự án Demo Thực Hành: Slot 5 & Slot 6 (NestJS & Next.js REST API with Prisma & PostgreSQL)

Dự án này được thiết kế để giải quyết trọn vẹn và đạt điểm tối đa cho cả 2 slot thực hành:
* **Slot 5:** *NestJS introduction, create nestjs app, using Prisma with postgres database*
* **Slot 6:** *Build Rest API with Nextjs to connect with Postgres database, define model with Prisma*

---

## 🌟 Kiến trúc Tổng quan

Cả hai ứng dụng đều kết nối vào **chung một cơ sở dữ liệu PostgreSQL** và chia sẻ cùng cấu trúc **Prisma Schema**:

```
                       ┌──────────────────────────────┐
                       │    PostgreSQL Database       │
                       │ (Docker hoặc Cloud Postgres) │
                       └──────────────┬───────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
                 ▼                                         ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│       SLOT 5: NestJS API        │       │       SLOT 6: Next.js API       │
│        (Port: 3001)             │       │        (Port: 3000)             │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ • Modular Architecture          │       │ • App Router Route Handlers     │
│ • Controllers & Services (DI)   │       │ • REST Endpoints:               │
│ • DTO & class-validator         │       │   - /api/users (GET, POST)      │
│ • PrismaService Lifecycle       │       │   - /api/posts (GET, POST, DEL) │
│ • Interactive Swagger UI:       │       │ • Interactive Web Dashboard UI  │
│   http://localhost:3001/api     │       │   http://localhost:3000         │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 🗄️ Bước 1: Khởi động PostgreSQL

Bạn có 2 lựa chọn:

### Lựa chọn 1: Dùng Docker Compose (Khuyên dùng trên máy cá nhân)
Mở Docker Desktop trên máy tính, sau đó mở terminal tại thư mục gốc dự án và chạy:
```bash
docker compose up -d
```
Lệnh này sẽ khởi động container PostgreSQL 16 tại cổng `5432` với:
* User: `postgres`
* Password: `postgrespassword`
* Database: `demo_db`

### Lựa chọn 2: Dùng Cloud PostgreSQL miễn phí (Không cần cài Docker)
1. Đăng ký tài khoản miễn phí tại [Neon.tech](https://neon.tech) hoặc [Supabase.com](https://supabase.com).
2. Tạo một database mới và copy chuỗi kết nối (Connection String).
3. Dán chuỗi kết nối vào biến `DATABASE_URL` trong cả 2 file:
   - `slot5-nestjs-api/.env`
   - `slot6-nextjs-api/.env`

---

## 🚀 Bước 2: Cài đặt và Chạy Slot 5 (NestJS)

Mở một tab Terminal:
```bash
cd slot5-nestjs-api

# 1. Cài đặt các thư viện
npm install

# 2. Sinh Prisma Client & Migrate bảng vào PostgreSQL
npx prisma generate
npx prisma migrate dev --name init

# 3. (Tùy chọn) Nạp dữ liệu mẫu ban đầu
npm run seed

# 4. Chạy NestJS ở chế độ phát triển
npm run start:dev
```
- Server NestJS chạy tại: `http://localhost:3001`
- **Mở Swagger UI để test API:** [http://localhost:3001/api](http://localhost:3001/api)

---

## ⚡ Bước 3: Cài đặt và Chạy Slot 6 (Next.js)

Mở một tab Terminal thứ hai:
```bash
cd slot6-nextjs-api

# 1. Cài đặt các thư viện
npm install

# 2. Sinh Prisma Client
npx prisma generate

# 3. Chạy Next.js
npm run dev
```
- Trang Dashboard & REST API chạy tại: [http://localhost:3000](http://localhost:3000)
- Các REST API endpoints trực tiếp:
  - `GET http://localhost:3000/api/users`
  - `POST http://localhost:3000/api/users`
  - `GET http://localhost:3000/api/posts`
  - `POST http://localhost:3000/api/posts`
  - `DELETE http://localhost:3000/api/posts/:id`

---

## 🎤 Kịch bản Thuyết trình / Chấm điểm ấn tượng

Khi trình bày cho giảng viên hoặc hội đồng đánh giá:

1. **Chứng minh Slot 5 (NestJS + Prisma):**
   - Mở file `slot5-nestjs-api/src/prisma/prisma.service.ts` để giải thích cách NestJS quản lý vòng đời kết nối CSDL (`onModuleInit`, `onModuleDestroy`).
   - Mở `slot5-nestjs-api/src/users/users.controller.ts` và `posts.service.ts` để giải thích cơ chế Dependency Injection và DTO Validation.
   - Mở trình duyệt vào `http://localhost:3001/api`, dùng Swagger bấm **Try it out** để tạo 1 User mới: `thaygiao@fpt.edu.vn`.

2. **Chứng minh Slot 6 (Next.js REST API + Prisma):**
   - Mở file `slot6-nextjs-api/app/api/posts/route.ts` để giải thích cấu trúc **Route Handlers** (`export async function GET/POST`) của Next.js App Router.
   - Mở file `slot6-nextjs-api/lib/prisma.ts` để giải thích kỹ thuật Singleton chống rò rỉ kết nối khi hot-reload trong Next.js.
   - Mở trình duyệt vào `http://localhost:3000` (Giao diện Slot 6):
     * Bạn sẽ thấy ngay User `thaygiao@fpt.edu.vn` vừa tạo từ NestJS xuất hiện tức thì trong danh sách (chứng minh dùng chung PostgreSQL qua Prisma)!
     * Dùng form trên giao diện Next.js để đăng một bài viết mới.
     * Mở lại Swagger của NestJS hoặc click link `GET /api/posts` để xem bài viết vừa thêm.
