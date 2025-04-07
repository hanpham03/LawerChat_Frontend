"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User } from "lucide-react";

const users = ["User 1", "User 2", "User 3"];

export default function ChatbotPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [chatbots, setChatbots] = useState<any[]>([]);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/chatbots/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChatbots(data);
      } catch (error) {
        console.error("Error fetching chatbots:", error);
      }
    };

    fetchChatbots();
  }, []);

  const filteredChatbots = chatbots.filter(
    (bot) =>
      (!selectedUser || bot.user === selectedUser) &&
      bot.name.toLowerCase().includes(search.toLowerCase())
  );

  if (chatbots.length === 0) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Tìm kiếm và lọc */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm chatbot..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        <Select onValueChange={setSelectedUser}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Chọn người dùng" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user} value={user}>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {user}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Danh sách chatbot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChatbots.map((bot) => (
          <Card
            key={bot.name}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={bot.avatar} alt={bot.name} />
                <AvatarFallback>{bot.name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle>{bot.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Người dùng: {bot.user}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
