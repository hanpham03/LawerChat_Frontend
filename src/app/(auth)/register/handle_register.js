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

  const [otp, setOtp] = useState(""); // 🔹 Biến lưu mã OTP nhập vào
  const [isOtpSent, setIsOtpSent] = useState(false); // 🔹 Kiểm tra xem đã gửi OTP chưa
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = "http://localhost:3001/api/auth";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 👉 Gửi OTP đến email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/sendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email,
          full_name: formData.fullname,
      }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gửi OTP thất bại");
      }

      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setIsOtpSent(true); // 🔹 Hiển thị ô nhập OTP
    } catch (err) {
      toast.error(`Lỗi gửi OTP: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 👉 Xác nhận OTP và hoàn tất đăng ký
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp,
          password: formData.password,
          full_name: formData.fullname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xác thực OTP thất bại");
      }

      toast.success("Đăng ký thành công!");
      router.push("/login");
    } catch (err) {
      toast.error(`Lỗi xác thực OTP: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
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

        {/* 🔹 Khi OTP đã được gửi, hiển thị ô nhập OTP */}
        {isOtpSent && (
          <div className="mb-6">
            <Label htmlFor="otp">Nhập mã OTP</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Đang xử lý..."
            : isOtpSent
            ? "Xác nhận OTP"
            : "Gửi mã OTP"}
        </Button>
      </form>
    </>
  );
}
