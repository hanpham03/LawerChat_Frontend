"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import handle_logout from "./handle_logout";
import { FaBalanceScale } from "react-icons/fa";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  id?: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // 🟢 Hàm lấy role từ token
  const fetchRole = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      setUserId(null);
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token); // 🛠️ Giải mã token
      setUserId(decodedToken.id || null);
      setRole(decodedToken.role || null);
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      setRole(null);
      setUserId(null);
    }
  };

  // 🟢 Lấy role ngay khi component mount + lắng nghe thay đổi trong localStorage
  useEffect(() => {
    fetchRole(); // Lấy role ngay khi component được render lần đầu

    // 🟢 Lắng nghe thay đổi trong cùng tab
    const handleTokenChange = () => {
      fetchRole();
    };

    window.addEventListener("storage", handleTokenChange); // Lắng nghe từ tab khác
    window.addEventListener("tokenChanged", handleTokenChange); // Lắng nghe từ cùng tab

    return () => {
      window.removeEventListener("storage", handleTokenChange);
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, []);

  // 🛑 Ẩn Navbar trên trang đăng nhập & đăng ký
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null;
  }

  // 📝 Danh sách link điều hướng dành cho ADMIN
  const adminNavLinks = [
    { href: "/views/admin/ManageChatbots", label: "Chatbots List" },
    { href: "/views/admin/ManageBlog", label: "Manage Blogs" },
    { href: "/views/admin/ChatbotConfig", label: "Chatbot Config" },
  ];

  // 📝 Danh sách link điều hướng dành cho USER
  const userNavLinks = [
    { href: "/views/ChatbotLists", label: "Danh Sách Chatbot" },
    { href: "/views/pricing", label: "Bảng Giá" },
    { href: "/views/blog", label: "Bài Viết" },
  ];

  // Chọn danh sách link phù hợp với role
  const navLinks = role === "admin" ? adminNavLinks : userNavLinks;

  // Để tránh warning về userId không được sử dụng, ta có thể log nó hoặc dùng nó ở đâu đó
  console.log("Current user ID:", userId);

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo và các link điều hướng */}
          <div className="flex flex-1 items-center">
            <FaBalanceScale size={28} className="text-green-600" />
            <Link href="/views/LawerChatHome">
              <h1 className="ml-2 text-xl font-bold text-green-600 hover:text-green-700 transition-colors">
                LawerChat
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-8 ml-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side: Các nút hành động */}
          <div className="flex flex-1 items-center justify-end space-x-4">
            {role !== "admin" && (
              <Button className="bg-green-600 text-white hover:bg-green-700 transition-colors">
                <Link href="/views/ChatbotCreate">Tạo Chatbot</Link>
              </Button>
            )}
            <Button className="bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
              <Link href="/views/profile">Tài Khoản</Link>
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
              onClick={handle_logout}
            >
              Đăng Xuất
            </Button>
          </div>

          {/* Nút mở/đóng menu trên Mobile */}
          <div className="md:hidden ml-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {role !== "admin" && (
            <Link
              href="/views/ChatbotCreate"
              className="block rounded-md px-3 py-2 text-base font-medium text-green-600 hover:bg-green-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tạo Chatbot
            </Link>
          )}
          <Link
            href="/views/profile"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tài Khoản
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handle_logout();
            }}
            className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Đăng Xuất
          </button>
        </div>
      )}
    </header>
  );
}
