"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define a type for user profile information based on your User model
interface UserProfile {
  _id: string;
  name: string; // Assuming your User model has a name field
  email: string;
  // Không có password vì API không trả về password
  createdAt?: string;
  updatedAt?: string;
  // Thêm các trường khác nếu có
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Bạn chưa đăng nhập");
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:3001/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Đảm bảo cookie được gửi
        });

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin người dùng");
        }

        const data = await response.json();
        console.log(data);
        setUserProfile(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Lỗi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công");
    router.push("/login");
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <p className="text-red-500">Lỗi: {error}</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Quay lại trang đăng nhập
        </Button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <p>Không tìm thấy thông tin người dùng</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Quay lại trang đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Thông tin tài khoản
      </h1>

      <div className="space-y-4">
        <div className="border-b pb-2">
          <label className="block text-sm font-medium text-gray-600">
            Họ tên
          </label>
          <p className="text-lg">{userProfile.full_name}</p>
        </div>

        <div className="border-b pb-2">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <p className="text-lg">{userProfile.email}</p>
        </div>

        {userProfile.createdAt && (
          <div className="border-b pb-2">
            <label className="block text-sm font-medium text-gray-600">
              Ngày tạo tài khoản
            </label>
            <p className="text-lg">{formatDate(userProfile.createdAt)}</p>
          </div>
        )}

        <div className="border-b pb-2">
          <label className="block text-sm font-medium text-gray-600">
            Mật khẩu
          </label>
          <div className="flex items-center">
            <p className="text-lg">********</p>
            <button
              onClick={() => router.push("/change-password")}
              className="ml-2 text-sm text-blue-500 hover:text-blue-700"
              type="button"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <Button
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          onClick={() => router.push("/edit-profile")}
        >
          Cập nhật thông tin
        </Button>
        <Button
          className="flex-1 bg-red-500 hover:bg-red-600"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
