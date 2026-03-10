## Báo cáo kiểm thử API (HireWave)

### 1) Thông tin môi trường
- **Ngày kiểm thử**:
- **Người kiểm thử**:
- **Backend**: HireWave (Spring Boot)
- **Base URL**: `http://localhost:8080`
- **Cách chạy**: `./gradlew clean bootRun`
- **Công cụ**:
  - Swagger UI: `/swagger-ui/index.html`
  - (tuỳ chọn) Postman / curl
- **DB / dữ liệu test**:
- **Tài khoản test**:
  - Candidate:
  - Employer:
  - Admin:

### 2) Tiêu chí pass/fail
- **Chức năng**: đúng luồng nghiệp vụ, status code đúng (200/201/400/401/403/404), response đúng schema.
- **Hiệu năng** (đề xuất):
  - P95 < 500ms cho GET list/detail khi dữ liệu vừa phải
  - Upload CV / parsing PDF: P95 < 3000ms (tuỳ file)
- **Bảo mật**:
  - API cần đăng nhập: trả 401 nếu không token / token sai
  - API admin: trả 403 nếu không role ADMIN
  - Không rò rỉ stacktrace/chi tiết nội bộ ở response

---

## 3) Kết quả kiểm thử chức năng (Functional)

> Ghi theo mẫu: **ID – Endpoint – Mục tiêu – Input – Kết quả mong đợi – Kết quả thực tế**

### 3.1 Auth
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-AUTH-01 | `POST /auth/login` | Đăng nhập lấy JWT | `{"email":"...","password":"..."}` | 200 + token |  |  |  |

### 3.2 User
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-USER-01 | `POST /users/register` | Đăng ký | `UserDTO` hợp lệ | 201 |  |  |  |
| F-USER-02 | `POST /users/changePass` | Đổi mật khẩu | `LoginDTO` | 200 |  |  |  |
| F-USER-03 | `POST /users/sendOtp/{email}` | Gửi OTP | email hợp lệ | 200 |  |  |  |
| F-USER-04 | `GET /users/verifyOtp/{email}/{otp}` | Verify OTP | otp 6 số | 202 |  |  |  |
| F-USER-05 | `GET /users/getAll/paged` | Danh sách user (paged) | `page,size,sortBy` | 200 + Page |  |  |  |

### 3.3 Jobs
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-JOB-01 | `GET /jobs/getAll` | Lấy tất cả job | - | 200 + list |  |  |  |
| F-JOB-02 | `GET /jobs/getAll/paged` | Job phân trang | `page,size,sortBy` | 200 + Page |  |  |  |
| F-JOB-03 | `GET /jobs/get/{id}` | Chi tiết job | id tồn tại | 200 + JobDTO |  |  |  |
| F-JOB-04 | `POST /jobs/post` | Đăng job | `JobDTO` hợp lệ | 201 |  |  |  |
| F-JOB-05 | `POST /jobs/apply/{id}` | Apply job | `ApplicantDTO` | 200 |  |  |  |
| F-JOB-06 | `POST /jobs/changeAppStatus` | Đổi trạng thái ứng tuyển | `Application` | 200 |  |  |  |
| F-JOB-07 | `GET /jobs/history/{id}/{applicationStatus}` | Lịch sử apply | id + enum | 200 |  |  |  |
| F-JOB-08 | `DELETE /jobs/delete/{id}` | Xoá job | id | 200 |  |  |  |

### 3.4 Profiles
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-PRO-01 | `GET /profiles/get/{id}` | Lấy profile | id | 200 |  |  |  |
| F-PRO-02 | `PUT /profiles/update` | Cập nhật profile | `ProfileDTO` | 200 |  |  |  |
| F-PRO-03 | `GET /profiles/getAll/paged` | Profile phân trang | `page,size,sortBy` | 200 |  |  |  |

### 3.5 CV (UserResume)
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-CV-01 | `POST /cv/upload` | Upload CV | multipart `file` + `title` | 201 |  |  |  |
| F-CV-02 | `GET /cv/my` | Danh sách CV của tôi | - | 200 + list |  |  |  |
| F-CV-03 | `GET /cv/file/{id}` | Xem/tải CV | id | 200 + bytes |  |  |  |
| F-CV-04 | `PUT /cv/{id}/default` | Set default CV | id | 200 |  |  |  |
| F-CV-05 | `DELETE /cv/delete/{id}` | Xoá CV | id | 200 |  |  |  |

### 3.6 Notification
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-NOTI-01 | `GET /notification/get/{userId}` | Lấy unread notifications | userId | 200 + list |  |  |  |
| F-NOTI-02 | `PUT /notification/read/{id}` | Mark as read | id | 200 |  |  |  |

### 3.7 Candidate AI Parsing (AI quan trọng)
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-AI-01 | `POST /api/candidate-ai/parsing/evaluate-text` | Chấm CV từ text | text dài | 200 + ParsingResult |  |  |  |
| F-AI-02 | `POST /api/candidate-ai/parsing/evaluate-text-v2` | Chấm CV V2 từ text | text dài | 200 + ParsingResultV2 |  |  |  |
| F-AI-03 | `POST /api/candidate-ai/parsing/evaluate-pdf` | Chấm CV từ PDF | multipart `file` hoặc `base64` | 200 + score + parsedInfo |  |  |  |

### 3.8 Admin (Role ADMIN)
| ID | Endpoint | Mục tiêu | Input mẫu | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| F-ADM-01 | `GET /admin/users` | Lấy user (admin) | - | 200 |  |  |  |
| F-ADM-02 | `GET /admin/jobs` | Lấy jobs (admin) | - | 200 |  |  |  |
| F-ADM-03 | `GET /admin/employers/pending` | Employer pending | - | 200 |  |  |  |
| F-ADM-04 | `POST /admin/employers/{id}/approve` | Approve employer | id | 200 |  |  |  |
| F-ADM-05 | `GET /admin/jobs/pending` | Job pending | - | 200 |  |  |  |
| F-ADM-06 | `POST /admin/jobs/{id}/approve` | Approve job | id | 200 |  |  |  |

---

## 4) Kết quả kiểm thử hiệu năng (Performance)

### 4.1 Đo thủ công trên Swagger UI
- Ghi thời gian phản hồi hiển thị ở phần response (hoặc DevTools Network).

| ID | Endpoint | Kịch bản | Số lần | Avg (ms) | P95 (ms) | Pass/Fail | Ghi chú |
|---|---|---|---:|---:|---:|---|---|
| P-01 | `GET /jobs/getAll/paged?page=0&size=20` | Load danh sách job | 20 |  |  |  |  |
| P-02 | `GET /jobs/get/{id}` | Xem chi tiết job | 20 |  |  |  |  |
| P-03 | `POST /api/candidate-ai/parsing/evaluate-pdf` | Parse & score PDF 1 trang | 10 |  |  |  |  |
| P-04 | `POST /api/candidate-ai/parsing/evaluate-pdf` | Parse & score PDF 3-5 trang | 10 |  |  |  |  |

### 4.2 (Tuỳ chọn) Đo bằng curl
- Ví dụ:
  - `curl -w "time_total=%{time_total}\n" -o NUL -s http://localhost:8080/jobs/getAll`

---

## 5) Kết quả kiểm thử bảo mật (Security)

| ID | Kiểm thử | Endpoint | Bước thực hiện | Mong đợi | Thực tế | Pass/Fail | Ghi chú |
|---|---|---|---|---|---|---|---|
| S-01 | Không token | `GET /jobs/getAll` | Gọi API không Authorization | 401 |  |  |  |
| S-02 | Token sai | `GET /cv/my` | Authorization: `Bearer abc` | 401 |  |  |  |
| S-03 | Role không đủ | `GET /admin/users` | Login user thường rồi gọi | 403 |  |  |  |
| S-04 | IDOR CV | `GET /cv/file/{id}` | Dùng user A gọi CV user B | 403/404 |  |  |  |
| S-05 | Validate input | `POST /users/register` | email sai format | 400 |  |  |  |
| S-06 | Upload file lạ | `POST /cv/upload` | upload `.exe`/mime lạ | 400/415 |  |  |  |
| S-07 | PDF encrypted | `POST /api/candidate-ai/parsing/evaluate-pdf` | upload pdf encrypted | 400 + message |  |  |  |

---

## 6) Tổng kết
- **Tổng số test case**:
- **Pass**:
- **Fail**:
- **Issue quan trọng**:
  - [ ] 401/403 sai
  - [ ] Lỗi parse CV / upload CV
  - [ ] Chậm (P95 vượt ngưỡng)
  - [ ] Rò rỉ thông tin lỗi (stacktrace)

