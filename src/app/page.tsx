import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex flex-col">
      {/* Thanh điều hướng */}
      <div className="absolute top-4 right-4 space-x-4">
        <Link href="/register">
          <Button className="border-white text-white px-4 py-2 rounded-lg shadow-md hover:bg-white hover:text-teal-600 transition-all duration-300">
            Đăng ký
          </Button>
        </Link>
        <Link href="/login">
          <Button className="bg-white text-teal-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300">
            Đăng nhập
          </Button>
        </Link>
      </div>

      {/* Nội dung chính */}
      <div className="flex items-center justify-center flex-1 px-4">
        <div className="text-center p-10 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-xl max-w-lg">
          <h1 className="text-6xl font-extrabold mb-4 drop-shadow-xl text-gray-100">
            LawerChat
          </h1>
          <p className="text-lg text-gray-100 max-w-md mx-auto leading-relaxed">
            Đồng hành cùng doanh nghiệp - Giải pháp tư vấn pháp lý doanh nghiệp
            thông minh 24/7 với độ chính xác vượt trội
          </p>
        </div>
      </div>
    </div>
  );
}
