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
}

interface DecodedToken {
  user_id: string; // Hoặc số, tùy vào server trả về kiểu gì
}

export default function ChatbotList() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [difyToken, setDifyToken] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [listChatbot, setListChatbot] = useState<any[]>([]);
  const router = useRouter();
  const { deleteChatbot } = useChat();

  // Lấy user_id từ token trong localStorage
  useEffect(() => {
    // lấy dify token
    const difyToken = localStorage.getItem("dify_token");
    if (!difyToken) {
      console.error("Không tìm thấy difyToken trong localStorage!");
      return;
    } else {
      setDifyToken(difyToken);
    }
    // lấy website token
    const token = localStorage.getItem("token");
    setAuthToken(token);
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
  }, []);

  // gọi api lấy tất cả chatbot hiện tại trong dify, để nhận về 1 mảng gồm id và name
  useEffect(() => {
    const fetchChatbotsDify = async () => {
      if (!difyToken) return; // Tránh gọi API khi chưa có token

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

  // Gọi API lấy tất cả chatbot của một user
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
    router.push("./ChatbotCreate"); // Điều hướng đến trang tạo chatbot
  };

  const removeChatbot = async (chatbotId: number, dify_chatbot_id: string) => {
    try {
      const dify_token = localStorage.getItem("dify_token");
      const token = localStorage.getItem("token");

      if (!dify_token || !token) {
        console.error("❌ Không tìm thấy token!");
        return;
      }

      // Gọi API để xóa chatbot
      await deleteChatbot(chatbotId, dify_chatbot_id, token);

      // Cập nhật danh sách chatbot sau khi xóa
      setChatbots((prevChatbots) =>
        prevChatbots.filter((bot) => bot.id !== chatbotId)
      );
    } catch (error) {
      console.error("🚨 Lỗi khi xóa chatbot:", error);
    }
  };

  const handleChatbotClick = async (chatbotId: number) => {
    try {
      // 📌 Lấy token từ localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token!");
      const dify_token = localStorage.getItem("dify_token");
      if (!dify_token) throw new Error("Không tìm thấy dify token!");

      // ✅ Giải mã token để lấy user_id
      const decoded = jwtDecode(token);
      const userId = decoded?.id; // 👉 ID của user từ token

      if (!userId) throw new Error("Không tìm thấy user_id!");

      // 📌 Lấy danh sách phiên chat của chatbot này
      const sessions = await getSessionByChatbotId(chatbotId, userId, token);

      let selectedSessionId = null;

      if (sessions.length > 0) {
        // ✅ Chọn phiên chat có ID lớn nhất của chatbot này
        selectedSessionId = Math.max(...sessions.map((s) => s.id));
      } else {
        // 🔹 Nếu không có phiên nào, tạo mới
        selectedSessionId = await startNewChatSession(userId, token, chatbotId);
      }

      if (!selectedSessionId) throw new Error("Lỗi khi chọn phiên chat");

      // 📌 Chuyển hướng đến Home với chatbotId & phiên chat đã chọn
      router.push(
        `/views/home?chatbotId=${chatbotId}&sessionId=${selectedSessionId}`
      );
    } catch (error) {
      console.error("Lỗi khi chọn chatbot:", error);
    }
  };

  // Lọc danh sách chatbot hiển thị
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
        <>
          {filteredChatbots.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600 mb-6">
                Chưa có chatbot nào được tạo, hãy tạo chatbot mới để chat với
                chúng tôi ngay!
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={handleAddChatbot}
                  className="flex items-center gap-2 text-lg px-6 py-3 bg-green-500 hover:bg-green-600 transition-all shadow-lg"
                >
                  <Plus className="w-6 h-6" /> Thêm Chatbot
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredChatbots.map((bot) => (
                  <Card
                    key={bot.id}
                    className="min-w-[250px] h-[200px] flex flex-col items-center justify-center shadow-lg border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleChatbotClick(bot.id)}
                  >
                    <CardContent className="text-xl font-semibold text-center">
                      🤖 {bot.name}
                    </CardContent>
                    <CardContent className="text-sm font-semibold text-center">
                      {bot.description}
                    </CardContent>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="mt-4"
                      onClick={async (e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện click vào Card
                        await removeChatbot(bot.id, bot.dify_chatbot_id); // Gọi hàm xóa
                      }}
                    >
                      <Trash2 className="w-6 h-6" />
                    </Button>
                  </Card>
                ))}
              </div>

              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleAddChatbot}
                  className="flex items-center gap-2 text-lg px-6 py-3 bg-green-500 hover:bg-green-600 transition-all shadow-lg"
                >
                  <Plus className="w-6 h-6" /> Thêm Chatbot
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
