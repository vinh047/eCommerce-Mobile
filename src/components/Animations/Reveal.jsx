"use client";
import { motion } from "framer-motion";

export default function Reveal({ 
  children, 
  delay = 0, 
  direction = "up", // up, down, left, right
  className = "",
  fullWidth = false // Có muốn div bọc chiếm 100% width không
}) {
  // Cấu hình hướng bay vào
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  const initial = { opacity: 0, ...directions[direction] };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // Chạy 1 lần khi lướt tới
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={className}
      style={{ width: fullWidth ? "100%" : "auto" }}
    >
      {children}
    </motion.div>
  );
}