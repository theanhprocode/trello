# Trello Clone

Ứng dụng quản lý công việc lấy cảm hứng từ Trello, xây dựng để thực hành React và các công nghệ liên quan.

**Demo:** https://trello-rose-zeta.vercel.app

## Giới thiệu

Đây là phần frontend của một bản clone Trello, hỗ trợ:

- Board chứa các column và card
- Kéo thả column và card (bao gồm kéo card giữa các column)
- Đăng ký, xác thực email, đăng nhập/đăng xuất
- Tự động refresh token khi hết hạn
- Thông báo realtime qua Socket.io (mời vào board)
- Chi tiết card: upload ảnh bìa, mô tả markdown, bình luận
- Mời thành viên vào board (chấp nhận/từ chối)
- Phân trang danh sách board
- Chuyển đổi Dark mode / Light mode

## Công nghệ sử dụng

**Frontend:**
- React 18 + Vite
- Redux Toolkit + Redux Persist
- Material UI v5
- React Router v6
- Axios (interceptor xử lý auth)
- dnd-kit (kéo thả)
- Socket.io Client
- React Hook Form
- React Markdown Editor (@uiw/react-md-editor)

**Backend:** Node.js + Express + MongoDB (repo riêng, deploy trên Render)

## Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd trello

# Cài dependencies
yarn install

# Chạy dev server (cần backend chạy ở localhost:8017)
yarn dev
```

## Cấu trúc thư mục

```
src/
  apis/            # Các hàm gọi API (axios)
  assets/          # Ảnh, icon tĩnh
  components/      # Component dùng chung (AppBar, Modal, Form, ...)
  customHooks/     # Custom React hooks
  customLibraries/ # Custom dnd-kit sensors
  pages/           # Các trang (Auth, Boards, Settings, Users, 404)
  redux/           # Redux store và các slice (activeBoard, activeCard, user, notifications)
  utilities/       # Hằng số, formatter, validator, cấu hình axios
```

## Môi trường

- Dev: `http://localhost:8017`
- Production: `https://trello-api-wd33.onrender.com`

Tự động xử lý qua `import.meta.env.DEV` / `import.meta.env.PROD` của Vite.

## Deploy

Frontend deploy trên **Vercel**, cấu hình SPA routing trong `vercel.json`.

Backend deploy trên **Render**.