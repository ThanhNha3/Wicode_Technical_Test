# 📝 React + Vite Editable Table Project
Dự án này là một **React + Vite project** với TypeScript, TailwindCSS và Redux Toolkit, xây dựng một **bảng dữ liệu có thể chỉnh sửa**, **thêm hàng mới**, **lọc dữ liệu với debounce**, và **virtual scroll**. Dữ liệu được persist qua **localStorage**.
---

## 📌 Tính năng

* Các ô có thể chỉnh sửa với kiểm tra dữ liệu ngay lập tức
* Thêm hàng (Add row) với lưu dữ liệu ngay lập tức
* Dữ liệu được lưu vĩnh viễn trên localStorage
* Tìm kiếm / lọc với debounce để giảm số lần xử lý
* Cuộn ảo (virtual scrolling) cho bộ dữ liệu lớn
* Chọn hàng / Chọn tất cả (Select / Select all)
---

## ⚡ 1. Setup & Run

### 1.1 Yêu cầu

* Node.js ≥ 16
* npm / yarn / pnpm

Check version:

```bash
node -v
npm -v
```

---

### 1.2 Cài đặt dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn
```

---

### 1.3 Chạy trong môi trường development

```bash
npm run dev
```

Open browser:

```
http://localhost:5173
```

---

### 1.4 Build cho môi trường production

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

Output folder: `dist/`

## 💡 3. Design Decisions & Trade-offs

1. **LocalStorage để lưu trữ dữ liệu**

   * Vì bài test không yêu cầu backend nên em đã sử dụng LocalStorage để lưu lại phần dữ liệu được API trả về ban đầu
   * Sau đó em sử dụng data trong LocalStorage làm nguồn data chính và có thể thực hiện chỉnh sửa trên đó

2. **Infinity scrolling** (`@tanstack/react-virtual`)

   * Điểm mạnh: Em đã sử dụng thư viện @tanstack/react-virtual để có thể support và handle tập dữ liệu lớn từ API trả về
   * Điểm yếu: Mặc dù đã xử lí được phần infinity scroll nhưng việc cần tối ưu code cho việc chỉnh sửa từng cell thì chưa được tối ưu lắm ạ

3. **Inline validation per cell**

   * Điểm mạnh: Chức năng đã hoạt động được việc edit inline
   * Điểm yếu: Các logic vẫn chưa được tối ưu và rõ ràng

4. **Debounced search**

   * Điểm mạnh: Em sử dụng để giảm việc re-render không cần thiết cũng như giảm tải tài nguyên cho việc re-render
   * Điểm yếu: Gây delay khoảng 2-300ms cho user

5. **Redux for UI state** (searchQuery, addingRow)

   * Điểm mạnh: Giúp giảm việc dồn logic vào 1 component, việc tách ra giúp em dễ quản lí hơn
   * Điểm yếu: Hiện em mới chỉ dùng redux ở việc handle phần search, em nghĩ mình nên tìm tách để handle luôn phần logic edit các cell để component sạch và gọn hơn