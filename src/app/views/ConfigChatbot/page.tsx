"use client";
import { useState } from "react";
import Chat from "@/components/my_components/chat"; // Điều chỉnh đường dẫn import tùy dự án

interface Message {
  id: number;
  role: string;
  text: string;
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const difyChatbotId = "default_chatbot_id";

  const sendMessage = (message: string, dify_chatbot_id?: string): void => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: message },
    ]);

    // Simulate bot response
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Xin chào! Tôi có thể giúp gì?",
        },
      ]);
      setIsLoading(false);
    }, 1000);

    // Use dify_chatbot_id if needed (currently just for compatibility)
    console.log("Using dify_chatbot_id:", dify_chatbot_id);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  return (
    <div className="h-[600px] w-full flex bg-gray-100">
      {/* Phần trái: ô nhập văn bản + khung upload file */}
      <div className="w-1/2 grid grid-rows-[2fr,3fr] gap-4 border-r p-4">
        {/* Ô nhập văn bản */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-lg font-semibold">✍ Nhập Prompt của bạn</h2>
          <textarea
            className="mt-2 p-2 border rounded-md w-full h-full"
            placeholder="Viết hướng dẫn cho chatbot của bạn..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>
        {/* Ô upload file */}
        <div
          className={`p-4 rounded-lg shadow-md flex flex-col items-center justify-center border-2 border-dashed ${
            dragging
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300 bg-gray-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <h2 className="text-lg font-semibold mb-2">
            📜 Kéo thả file hoặc nhấn để tải lên
          </h2>
          <input
            type="file"
            className="hidden"
            id="fileUpload"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Chọn file
          </label>
          {file && <p className="mt-2 text-gray-600">📄 {file.name}</p>}
        </div>
      </div>
      {/* Phần phải: component Chat */}
      <div className="w-1/2 p-4">
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          isLoading={isLoading}
          dify_chatbot_id={difyChatbotId}
        />
      </div>
    </div>
  );
}
