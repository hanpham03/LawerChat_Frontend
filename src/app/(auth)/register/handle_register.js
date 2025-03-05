"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return;
    }

    // Tạo object mới khớp với cấu trúc DB
    const dataToSend = {
      email: formData.email,
      password: formData.password, // Backend sẽ xử lý hash password
      full_name: formData.fullname, // Đổi fullname thành full_name
      is_active: true, // Mặc định active
    };

    try {
      const response = await fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Gửi object đã được format
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // ✅ Hiển thị thông báo đăng ký thành công
      toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push("/login");
    } catch (err) {
      // ✅ Hiển thị thông báo lỗi khi đăng ký thất bại
      toast.error(`Lỗi đăng ký: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="fullname">Họ và tên</Label>
          <Input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Nhập họ và tên"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className="mb-4">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng Ký"}
        </Button>
      </form>
    </>
  );
}
