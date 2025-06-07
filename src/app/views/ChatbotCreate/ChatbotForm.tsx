"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// @ts-expect-error - Ignore type error for js-cookie until types are installed
import Cookies from "js-cookie";
import { handleChatbotTags } from "./ChatbotTags";
import ProviderModelSelector from "@/components/my_components/ProviderModelSelector";

const availableIcons = ["🤖", "😎", "🐱", "🦊", "👻"];

const providerMapping: { [key: string]: string } = {
  OpenRouter: "openrouter",
  NVIDIA: "nvidia",
  "Fireworks AI": "fireworks",
};

export default function ChatbotForm() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    user_id: null as number | null,
    name: "",
    description: "",
    prompt: "",
    icon: "🤖",
    provider: "OpenRouter",
    model: "openai/gpt-3.5-turbo",
    mode: "chat",
  });

  // Close icon picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowIconPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      toast.error("Không tìm thấy token, vui lòng đăng nhập.");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setFormData((prev) => ({ ...prev, user_id: payload.id }));
      setEmail(payload.email || "");
    } catch {
      toast.error("Lỗi khi lấy thông tin người dùng.");
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData((prev) => ({ ...prev, icon }));
    setShowIconPicker(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dify_token =
        localStorage.getItem("dify_token") || Cookies.get("dify_token");
      if (!dify_token) throw new Error("Token không hợp lệ.");

      const response = await fetch(
        "http://localhost:3001/api/chatbots/create-chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dify_token}`,
          },
          body: JSON.stringify({
            user_id: formData.user_id,
            name: formData.name,
            description: formData.description,
            prompt: formData.prompt,
            icon: formData.icon,
            provider: providerMapping[formData.provider] || formData.provider,
            nameModel: formData.model,
            mode: "chat",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Tạo chatbot thất bại");

      await handleChatbotTags(email, data.chatbotId, dify_token);
      toast.success("Tạo chatbot thành công!");
      router.push("/views/ChatbotLists");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
        Tạo Chatbot Mới
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên Chatbot với chọn icon */}
        <div className="relative">
          <Label htmlFor="name">Tên Chatbot</Label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowIconPicker((show) => !show)}
              className="text-2xl"
            >
              {formData.icon}
            </button>
            <Input
              id="name"
              name="name"
              placeholder="Nhập tên chatbot"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {showIconPicker && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-2 grid grid-cols-5 gap-2 bg-white p-2 border rounded shadow-md"
            >
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  className="p-1 text-2xl hover:bg-gray-100 rounded"
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <Label htmlFor="description">Mô tả (Không bắt buộc)</Label>
          <Input
            id="description"
            name="description"
            placeholder="Nhập mô tả"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Prompt */}
        <div>
          <Label htmlFor="prompt">Prompt Chatbot</Label>
          <Textarea
            id="prompt"
            name="prompt"
            placeholder="Nhập prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
          />
        </div>

        {/* Chọn Provider & Model */}
        <ProviderModelSelector
          provider={formData.provider}
          model={formData.model}
          onProviderChange={(provider) =>
            setFormData((prev) => ({ ...prev, provider }))
          }
          onModelChange={(model) => setFormData((prev) => ({ ...prev, model }))}
        />

        {/* Nút Submit */}
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading || !formData.user_id}
        >
          {isLoading ? "Đang xử lý..." : "Tạo Chatbot"}
        </Button>
      </form>
    </div>
  );
}
