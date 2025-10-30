# 🎯 Button.jsx — Hướng dẫn sử dụng

`Button.jsx` là một component React được thiết kế mobile-first, dễ truy cập (accessible), và tích hợp sẵn với Tailwind CSS. Nó phù hợp cho các ứng dụng thương mại điện tử sử dụng Next.js.

---

##  Tính năng nổi bật

- Thiết kế responsive, tối ưu cho thiết bị di động
- Tùy biến kích thước và kiểu dáng
- Hỗ trợ icon trái/phải, trạng thái loading, và nút chỉ có icon
- Tương thích với các thẻ HTML như `button`, `a`, v.v.
- Sử dụng props boolean để xác định giao diện: `primary`, `danger`, `success`, v.v.

---

## 🛠️ Props hỗ trợ

| Prop           | Mô tả                                                                 |
|----------------|----------------------------------------------------------------------|
| `primary`      | Giao diện chính (xanh dương)                                         |
| `secondary`    | Giao diện phụ (xám đậm)                                              |
| `outline`      | Viền xám, nền trắng                                                  |
| `ghost`        | Nền trong suốt, hover sáng                                           |
| `success`      | Thành công (xanh lá)                                                 |
| `warning`      | Cảnh báo (vàng cam)                                                  |
| `danger`       | Nguy hiểm (đỏ)                                                       |
| `size`         | Kích thước: `xs`, `sm`, `md`, `lg`, `xl`                             |
| `leftIcon`     | Icon hiển thị bên trái (Lucide icon component)                      |
| `rightIcon`    | Icon hiển thị bên phải                                              |
| `iconOnly`     | Nếu `true`, hiển thị nút chỉ có icon (cần `aria-label`)            |
| `loading`      | Hiển thị spinner và vô hiệu hóa tương tác                           |
| `disabled`     | Vô hiệu hóa nút                                                     |
| `fullWidth`    | Nếu `true`, nút sẽ chiếm toàn bộ chiều rộng của phần tử cha         |
| `as`           | Thẻ HTML hoặc component dùng để render (`button`, `a`, v.v.)        |
| `aria-label`   | Mô tả cho nút icon-only để hỗ trợ screen reader                     |

---

## 🎨 Các biến thể giao diện

```jsx
<Button primary>Primary</Button>
<Button secondary>Secondary</Button>
<Button outline>Outline</Button>
<Button ghost>Ghost</Button>
<Button success>Success</Button>
<Button warning>Warning</Button>
<Button danger>Danger</Button>
