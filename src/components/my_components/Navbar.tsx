"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import handle_logout from "./handle_logout";
// Sử dụng heroicons cho biểu tượng hamburger, bạn cần cài heroicons (npm install @heroicons/react)
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
    { href: "/views/pricing", label: "Bảng Giá" },
    { href: "/views/blog", label: "Bài Viết" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Nav Links on Desktop */}
          <div className="flex items-center">
            <FaBalanceScale size={32} color="black" />
            <Link href="/views/home">
              <h1 className="text-xl font-bold text-green-600">LawerChat</h1>
            </Link>
            <div className="hidden md:block ml-10">
              <nav className="flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-black hover:scale-105 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Buttons on Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-green-600 text-white hover:bg-green-700 hover:scale-105 transition-all duration-200">
              <Link href="/views/profile">Tài Khoản</Link>
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-transform duration-200"
              onClick={handle_logout}
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        <div className="md:hidden">
          <nav className="space-y-1 px-2 pb-3 pt-2">
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
            <div className="mt-2 space-y-1 border-t border-gray-200 pt-2">
              <Link
                href="/views/chatbot"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Chat
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
          </nav>
        </div>
      )}
    </header>
  );
}
