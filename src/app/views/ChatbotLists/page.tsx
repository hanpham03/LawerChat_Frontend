"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Chatbot {
  id: number;
  name: string;
}

export default function ChatbotList() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    {
      id: 1,
      name: "Chatbot AI",
    },
  ]);

  const addChatbot = () => {
    const newChatbot: Chatbot = {
      id: Date.now(),
      name: `Chatbot ${chatbots.length + 1}`,
    };
    setChatbots([...chatbots, newChatbot]);
  };

  const removeChatbot = (id: number) => {
    setChatbots(chatbots.filter((bot) => bot.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        📜 Danh sách Chatbot
      </h2>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {chatbots.map((bot) => (
          <Card
            key={bot.id}
            className="flex justify-between items-center p-3 shadow-md"
          >
            <CardContent className="text-lg font-semibold">
              🤖 {bot.name}
            </CardContent>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeChatbot(bot.id)}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={addChatbot}
          className="flex items-center gap-2 text-lg px-4 py-2 bg-green-500 hover:bg-green-600 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" /> Thêm Chatbot
        </Button>
      </div>
    </div>
  );
}
