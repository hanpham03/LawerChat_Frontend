"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Danh sách icon có sẵn để người dùng chọn
const availableIcons = ["🤖", "😎", "🐱", "🦊", "👻"];

export default function ChatbotForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_id: 1,
    name: "newchatbot",
    description: "",
    dify_chatbot_id: 1,
    status: "active",
    // Mặc định là emoji và chat, không cho chỉnh sửa
    icon_type: "emoji",
    icon: "🤖", // icon mặc định
    icon_background: "#FFEAD5",
    mode: "chat",
  });
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = "http://localhost:3000/api/chatbots/create-chatbot";

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

    // Lấy dify_token từ localStorage
    const difyToken = localStorage.getItem("dify_token");
    if (!difyToken) {
      toast.error("Không tìm thấy dify_token. Vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${difyToken}`,
        },
        body: JSON.stringify({
          user_id: formData.user_id,
          name: formData.name,
          description: formData.description,
          dify_chatbot_id: formData.dify_chatbot_id,
          status: formData.status,
          configuration: {
            icon_type: formData.icon_type, // mặc định "emoji"
            icon: formData.icon,
            icon_background: formData.icon_background,
            mode: formData.mode, // mặc định "chat"
          },
        }),
      });

      const data = await response.json();

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
                className={`text-3xl p-2 border rounded hover:border-green-600 transition-colors duration-200 ${formData.icon === icon
                    ? "border-green-600"
                    : "border-gray-300"
                  }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="icon_background" className="block mb-1">
            Màu Nền Icon
          </Label>
          <Input
            id="icon_background"
            name="icon_background"
            type="text"
            placeholder="Ví dụ: #FFEAD5"
            value={formData.icon_background}
            onChange={handleChange}
            required
            className="w-full"
          />
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
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Tạo Chatbot"}
        </Button>
      </form>
    </div>
  );
}
