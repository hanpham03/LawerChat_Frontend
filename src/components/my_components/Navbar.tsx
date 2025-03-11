"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import handle_logout from "./handle_logout";
import { FaBalanceScale } from "react-icons/fa";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ẩn Navbar nếu đang ở trang login hoặc register
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null;
  }

  const navLinks = [
    { href: "/views/ChatbotLists", label: "Danh Sách Chatbot" },
    { href: "/views/pricing", label: "Bảng Giá" },
    { href: "/views/blog", label: "Bài Viết" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo và các link điều hướng */}
          <div className="flex flex-1 items-center">
            <FaBalanceScale size={28} className="text-green-600" />
            <Link href="/views/home">
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
            <Button className="bg-green-600 text-white hover:bg-green-700 transition-colors">
              <Link href="/views/ChatbotCreate">Tạo Chatbot</Link>
            </Button>
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
          <Link
            href="/views/chatbot"
            className="block rounded-md px-3 py-2 text-base font-medium text-green-600 hover:bg-green-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tạo Chatbot
          </Link>
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
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
