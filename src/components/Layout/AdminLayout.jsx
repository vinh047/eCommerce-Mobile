"use client";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AdminLayout({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (storedTheme === "light" && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <div
          className={`min-h-screen transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "lg:ml-64"
          }`}
        >
          {/* Header */}
          <Header
            isDark={isDark}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
          />

          {/* Content */}
          <main className="">
            {children}
            <Toaster richColors />
          </main>
        </div>
      </div>
    </div>
  );
}
