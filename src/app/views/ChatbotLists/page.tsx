"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getSessionByChatbotId, startNewChatSession } from "@/app/utils/api";
import { useChat } from "@/app/hooks/useChat";

interface Chatbot {
  id: number;
  name: string;
  description?: string;
  dify_chatbot_id: string;
  isFixed?: boolean;
}

interface DecodedToken {
  id: string;
}

interface DifyChatbot {
  id: string;
  name: string;
  description?: string;
}

interface Session {
  id: number;
  chatbot_id: number;
  user_id: string;
}

export default function ChatbotList() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [difyToken, setDifyToken] = useState<string | null>(null);
  const [listChatbot, setListChatbot] = useState<DifyChatbot[]>([]);
  const router = useRouter();
  const { deleteChatbot } = useChat();

  // Chatbot cố định: Tư vấn luật doanh nghiệp
  const specialChatbot: Chatbot = {
    id: 0,
    name: "Chatbot Tư vấn luật doanh nghiệp",
    description: "Hỗ trợ tư vấn luật doanh nghiệp 24/7",
    dify_chatbot_id: "special_dify_id",
    isFixed: true,
  };

  useEffect(() => {
    const difyToken = localStorage.getItem("dify_token");
    if (!difyToken) {
      console.error("Không tìm thấy difyToken trong localStorage!");
      return;
    } else {
      setDifyToken(difyToken);
    }
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchChatbotsDify = async () => {
      if (!difyToken) return;

      try {
        const response = await fetch(
          "http://localhost:3001/api/chatbots/getAllChatbotDify",
          {
            headers: {
              Authorization: `Bearer ${difyToken}`,
            },
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch chatbots: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu API không phải là một mảng!");
        }

        setListChatbot(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chatbot Dify:", error);
      }
    };

    fetchChatbotsDify();
  }, [difyToken]);

  useEffect(() => {
    if (!userId) return;

    const fetchChatbots = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/chatbots/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chatbots");
        }
        const data: Chatbot[] = await response.json();
        setChatbots(data);
      } catch (error) {
        console.error("Error fetching chatbots:", error);
      }
    };

    fetchChatbots();
  }, [userId]);

  const handleAddChatbot = () => {
    router.push("./ChatbotCreate");
  };

  const removeChatbot = async (chatbotId: number, dify_chatbot_id: string) => {
    try {
      const dify_token = localStorage.getItem("dify_token");
      const token = localStorage.getItem("token");

      if (!dify_token || !token) {
        console.error("❌ Không tìm thấy token!");
        return;
      }

      await deleteChatbot(chatbotId, dify_chatbot_id, token);
      setChatbots((prevChatbots) =>
        prevChatbots.filter((bot) => bot.id !== chatbotId)
      );
    } catch (error) {
      console.error("🚨 Lỗi khi xóa chatbot:", error);
    }
  };

  const handleChatbotClick = async (
    chatbotId: number,
    dify_chatbot_id: string
  ) => {
    try {
      if (chatbotId === 0) {
        router.push(`/views/LawerChatHome`);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token!");
      const dify_token = localStorage.getItem("dify_token");
      if (!dify_token) throw new Error("Không tìm thấy dify token!");

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded?.id;
      if (!userId) throw new Error("Không tìm thấy user_id!");

      let selectedSessionId = null;

      const sessions: Session[] = await getSessionByChatbotId(
        chatbotId,
        userId
      );
      if (sessions.length > 0) {
        selectedSessionId = Math.max(...sessions.map((s: Session) => s.id));
      } else {
        selectedSessionId = await startNewChatSession(
          parseInt(userId),
          token,
          chatbotId
        );
      }

      if (!selectedSessionId) throw new Error("Lỗi khi chọn phiên chat");

      router.push(
        `/views/home?chatbotId=${chatbotId}&sessionId=${selectedSessionId}&difyChatbotId=${dify_chatbot_id}`
      );
    } catch (error) {
      console.error("Lỗi khi chọn chatbot:", error);
    }
  };

  const filteredChatbots = chatbots.filter((bot) =>
    listChatbot.some((difyBot) => difyBot.id === bot.dify_chatbot_id)
  );

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        📜 Danh sách Chatbot
      </h2>

      {!userId ? (
        <p className="text-center text-red-500">
          Không tìm thấy thông tin người dùng!
        </p>
      ) : (
        <div>
          {/* Chatbot cố định: Tư vấn luật doanh nghiệp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Card
              key={specialChatbot.id}
              className="min-w-[250px] h-[200px] flex flex-col justify-between shadow-lg border rounded-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={() =>
                handleChatbotClick(
                  specialChatbot.id,
                  specialChatbot.dify_chatbot_id
                )
              }
            >
              <div className="flex flex-col items-center pt-4">
                <CardContent className="text-xl font-semibold text-center p-2">
                  🤖 {specialChatbot.name}
                </CardContent>
                <CardContent className="text-sm font-semibold text-center p-2 overflow-hidden max-h-[60px]">
                  <div className="line-clamp-2">
                    {specialChatbot.description}
                  </div>
                </CardContent>
              </div>
              {/* Không hiển thị nút Cài đặt và Xóa cho chatbot cố định */}
            </Card>

            {/* Các chatbot khác từ API */}
            {filteredChatbots.length > 0 &&
              filteredChatbots.map((bot) => (
                <Card
                  key={bot.id}
                  className="min-w-[250px] h-[200px] flex flex-col justify-between shadow-lg border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                  onClick={() =>
                    handleChatbotClick(bot.id, bot.dify_chatbot_id)
                  }
                >
                  <div className="flex flex-col items-center pt-4">
                    <CardContent className="text-xl font-semibold text-center p-2">
                      🤖 {bot.name}
                    </CardContent>
                    <CardContent className="text-sm font-semibold text-center p-2 overflow-hidden max-h-[60px]">
                      <div className="line-clamp-2">{bot.description}</div>
                    </CardContent>
                  </div>

                  <div className="flex justify-center items-center w-full px-4 mb-4 gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl shadow-md hover:bg-gray-200 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/views/ChatbotConfig_User?ChatbotId=${bot.id}`
                        );
                      }}
                    >
                      ⚙️ Cài đặt
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition-all duration-200"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await removeChatbot(bot.id, bot.dify_chatbot_id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </Button>
                  </div>
                </Card>
              ))}
          </div>

          {/* Nút Thêm Chatbot */}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleAddChatbot}
              className="flex items-center gap-2 text-lg px-6 py-3 bg-green-500 hover:bg-green-600 transition-all shadow-lg"
            >
              <Plus className="w-6 h-6" /> Thêm Chatbot
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
