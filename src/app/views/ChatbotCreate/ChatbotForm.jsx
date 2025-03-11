"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie"; // Import Cookies để lấy token từ cookie

// Danh sách icon có sẵn để người dùng chọn
const availableIcons = ["🤖", "😎", "🐱", "🦊", "👻"];

export default function ChatbotForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_id: null, // Để null, sẽ cập nhật sau khi giải mã token
    name: "newchatbot",
    description: "",
    icon: "🤖", // icon mặc định
    mode: "chat",
  });
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = "http://localhost:3001/api/chatbots/create-chatbot";
  let token = localStorage.getItem("token") || Cookies.get("token");

  // 👉 Lấy token từ localStorage hoặc cookie
  useEffect(() => {
    const getToken = () => {
      if (!token) {
        toast.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        return;
      }

      try {
        // Giải mã token để lấy user_id
        const payload = JSON.parse(atob(token.split(".")[1])); // Giải mã JWT
        if (payload.id) {
          setFormData((prev) => ({ ...prev, user_id: payload.id }));
        } else {
          toast.error("Token không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        toast.error("Lỗi khi lấy thông tin người dùng.");
      }
    };

    getToken();
  }, []);

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

    // Kiểm tra user_id đã được cập nhật chưa
    if (!formData.user_id) {
      toast.error("Không lấy được ID người dùng. Vui lòng thử lại.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: formData.user_id,
          name: formData.name,
          description: formData.description,
          configuration: {
            icon: formData.icon,
            mode: formData.mode,
          },
        }),
      });

      const data = await response.json();
      console.log("data: ", data);
      if (!response.ok) {
        throw new Error(data.message || "Tạo chatbot thất bại");
      }

      toast.success("Tạo chatbot thành công!");
      router.push("/views/home");
    } catch (err) {
      toast.error(`Lỗi tạo chatbot: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
        Tạo Chatbot Mới
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="block mb-1">
            Tên Chatbot
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Nhập tên chatbot"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        {/* Phần chọn Icon */}
        <div>
          <Label htmlFor="icon" className="block mb-1">
            Chọn Icon
          </Label>
          <div className="flex space-x-4">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    icon: icon,
                  }))
                }
                className={`text-3xl p-2 border rounded hover:border-green-600 transition-colors duration-200 ${formData.icon === icon ? "border-green-600" : "border-gray-300"
                  }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="block mb-1">
            Mô tả
          </Label>
          <Input
            id="description"
            name="description"
            type="text"
            placeholder="Nhập mô tả cho chatbot"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isLoading || !formData.user_id}>
          {isLoading ? "Đang xử lý..." : "Tạo Chatbot"}
        </Button>
      </form>
    </div>
  );
}
