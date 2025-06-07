"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProviderModelSelector from "@/components/my_components/ProviderModelSelector";
import { getChatbotsInfor } from "@/app/utils/api";

export default function ChatbotConfigPage() {
  const searchParams = useSearchParams();
  const chatbotId = searchParams.get("ChatbotId");

  const [chatbotName, setChatbotName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("OpenRouter");
  const [model, setModel] = useState("openai/gpt-3.5-turbo");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchChatbotData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !chatbotId) {
          console.error("Missing token or chatbotId");
          return;
        }
        const data = await getChatbotsInfor(token, Number(chatbotId));
        setChatbotName(data.name || "");
        setDescription(data.description || "");
        if (data.configuration) {
          const configObj =
            typeof data.configuration === "string"
              ? JSON.parse(data.configuration)
              : data.configuration;
          setPrompt(configObj.prompt || "");
          setProvider(configObj.provider || "OpenRouter");
          setModel(configObj.nameModel || "openai/gpt-3.5-turbo");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chatbot:", error);
      }
    };

    fetchChatbotData();
  }, [chatbotId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("dify_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const configuration = {
        prompt,
        provider,
        nameModel: model, // Đổi "model" thành "nameModel"
      };

      const response = await fetch(
        `http://localhost:3001/api/chatbots/${chatbotId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: chatbotName,
            description,
            configuration,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update chatbot");
      }

      alert("Chatbot updated successfully!");
    } catch (error) {
      console.error("Error updating chatbot:", error);
      alert(`Failed to update chatbot`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-center mb-4">Cập nhật Chatbot</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label
            htmlFor="chatbotName"
            className="block text-base font-semibold text-gray-700 mb-1"
          >
            Tên Chatbot
          </Label>
          <Input
            id="chatbotName"
            name="chatbotName"
            type="text"
            placeholder="Nhập tên chatbot..."
            value={chatbotName}
            onChange={(e) => setChatbotName(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="block text-base font-semibold text-gray-700 mb-1"
          >
            Mô tả Chatbot
          </Label>
          <Input
            id="description"
            name="description"
            type="text"
            placeholder="Nhập mô tả cho chatbot..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label
            htmlFor="prompt"
            className="block text-base font-semibold text-gray-700 mb-1"
          >
            Prompt của Chatbot
          </Label>
          <Textarea
            id="prompt"
            name="prompt"
            placeholder="Nhập prompt cho chatbot..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[8rem] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
        </div>
        <ProviderModelSelector
          provider={provider}
          model={model}
          onProviderChange={(newProvider) => setProvider(newProvider)}
          onModelChange={(newModel) => setModel(newModel)}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </div>
  );
}
