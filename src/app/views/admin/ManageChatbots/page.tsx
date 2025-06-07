"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ✅ Define interface for chatbot
interface Chatbot {
  id: string;
  name: string;
  user_id: string;
  status: string;
  created_at: string;
  avatar?: string;
}

export default function ChatbotPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/chatbots/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChatbots(data);
      } catch (err: unknown) {
        console.error("Error fetching chatbots:", err);
        setError(
          err instanceof Error ? err.message : "Error fetching chatbots"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChatbots();
  }, []);

  if (loading) {
    return <div>Đang tải danh sách chatbot...</div>;
  }

  if (error) {
    return <div className="text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách Chatbots</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map((bot) => (
          <Card
            key={bot.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="flex items-center gap-4">
              <Avatar>
                {/* Nếu API trả về avatar URL, dùng AvatarImage */}
                {bot.avatar ? (
                  <AvatarImage src={bot.avatar} alt={bot.name} />
                ) : (
                  <AvatarFallback>{bot.name[0]}</AvatarFallback>
                )}
              </Avatar>
              <CardTitle>{bot.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">ID: {bot.id}</p>
              <p className="text-sm text-gray-600">User ID: {bot.user_id}</p>
              <p className="text-sm text-gray-600">Status: {bot.status}</p>
              <p className="text-sm text-gray-600">
                Created at: {new Date(bot.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
