"use client";
import { motion } from "framer-motion";

export default function FlipReveal({ 
  children, 
  index = 0, // Dùng để tính độ trễ (stagger) nếu nằm trong list
  className = "" 
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotateY: 90 }} // Trạng thái đầu: Xoay ngang 90 độ (ẩn)
      whileInView={{ opacity: 1, rotateY: 0 }} // Trạng thái cuối: Xoay về 0 độ (hiện)
      viewport={{ once: true, margin: "-50px" }} // Chạy 1 lần khi lướt tới
      transition={{
        type: "spring",
        stiffness: 70, // Độ cứng lò xo (càng lớn càng nảy mạnh)
        damping: 15,   // Độ cản (càng nhỏ càng rung lâu)
        mass: 1,
        delay: index * 0.05, // Mẹo: Mỗi item hiện chậm hơn item trước 0.05s tạo hiệu ứng domino
      }}
      style={{ perspective: 1000 }} // QUAN TRỌNG: Tạo chiều sâu 3D
    >
      {children}
    </motion.div>
  );
}