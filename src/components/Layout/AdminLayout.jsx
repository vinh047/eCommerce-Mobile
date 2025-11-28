"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AdminLayoutClient({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // AOS init
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  // Theme init
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
      {/* Sidebar */}
      <Suspense fallback={null}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </Suspense>

      {/* Main */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "lg:ml-64"
        }`}
      >
        {/* Header */}
        <Suspense fallback={null}>
          <Header
            isDark={isDark}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
          />
        </Suspense>

        {/* Content */}
        <main>
          <Suspense
            fallback={<div className="p-8 text-center">Loading...</div>}
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
