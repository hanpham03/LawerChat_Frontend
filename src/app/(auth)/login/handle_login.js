"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 
import { loginDify } from "./handle_loginDify";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = "http://localhost:3001/api/auth";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Bước 1: Đăng nhập vào hệ thống chính, gửi credentials để nhận cookie
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Đảm bảo cookie được gửi/nhận
      });
  
      const data = await response.json();
      if (response.ok && data.token) {
        // ✅ Lưu token vào localStorage
        localStorage.setItem("token", data.token);
        console.log("✅ Đăng nhập thành công, token đã lưu vào localStorage");
      }
  
      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      } else {
        // Không cần lưu token vào localStorage nữa vì đã set trong cookie từ backend
        toast.success("Đăng nhập thành công!");
    
        // Bước 2: Đăng nhập vào Dify (Gọi hàm loginDify)
        await loginDify();
    
        // Chuyển hướng đến trang chính
        router.push("/views/home");
      }
    } catch (err) {
      toast.error(`Lỗi đăng nhập: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
        </Button>
      </form>
    </>
  );
}
