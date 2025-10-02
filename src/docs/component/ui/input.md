# 📥 Input Component

Component `Input` là một trường nhập liệu có thể tùy biến cao, hỗ trợ nhiều tính năng như icon trái/phải, trạng thái lỗi, helper text, toggle mật khẩu, và responsive theo kích thước.

---

## ✅ Props

| Prop               | Type                | Default     | Mô tả                                                                 |
|--------------------|---------------------|-------------|------------------------------------------------------------------------|
| `type`             | `string`            | `"text"`    | Loại input (`text`, `password`, `email`, v.v.)                        |
| `size`             | `"sm" | "md" | "lg"` | `"md"`       | Kích thước input: nhỏ, vừa, lớn                                       |
| `leftIcon`         | `ReactNode`         | `undefined` | Icon hiển thị bên trái                                               |
| `rightAddon`       | `ReactNode`         | `undefined` | Nội dung hiển thị bên phải                                           |
| `error`            | `string`            | `undefined` | Hiển thị lỗi, làm viền và chữ chuyển sang màu đỏ                     |
| `helperText`       | `string`            | `undefined` | Hiển thị thông tin phụ bên dưới input                                |
| `disabled`         | `boolean`           | `false`     | Vô hiệu hóa input                                                    |
| `showPasswordToggle` | `boolean`         | `true`      | Cho phép hiện/ẩn mật khẩu nếu `type="password"`                      |
| `containerClassName` | `string`          | `undefined` | Class tùy chỉnh cho container ngoài cùng                             |
| `className`        | `string`            | `undefined` | Class tùy chỉnh cho thẻ `<input>`                                    |
| `fullWidth`        | `boolean`           | `false`     | Cho input chiếm toàn bộ chiều ngang                                  |
| `...props`         | `HTMLInputProps`    | —           | Các props gốc của thẻ `<input>`                                      |

---

## 🎨 Style & Behavior

- Khi có `error`, input sẽ:
  - Viền đỏ (`border-red-500`)
  - Placeholder đỏ (`placeholder:text-red-500`)
  - Ring đỏ khi focus (`focus:ring-red-500`)
  - Dòng chữ lỗi bên dưới (`text-red-500`) + hiệu ứng lắc nhẹ

- Khi có `leftIcon`, input sẽ được padding trái để tránh đè lên icon

- Khi có `rightAddon` hoặc là mật khẩu có toggle, input sẽ được padding phải tương ứng

- Nếu `type="password"` và `showPasswordToggle=true`, sẽ có nút hiện/ẩn mật khẩu

---

## 📦 Ví dụ sử dụng

```jsx
<Input
  placeholder="Tên sản phẩm"
  error="Không được để trống"
  size="md"
/>

<Input
  type="password"
  placeholder="Mật khẩu"
  showPasswordToggle
/>

<Input
  leftIcon={<Search />}
  placeholder="Tìm kiếm sản phẩm..."
  helperText="Nhập từ khóa để tìm"
  size="lg"
/>
