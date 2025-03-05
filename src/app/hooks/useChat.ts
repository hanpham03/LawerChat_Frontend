import { useEffect, useState } from "react";
import {
  getChatSessions,
  getMessages,
  sendMessageToAPI,
  startNewChatSession,
  deleteChatSessionAPI,
} from "@/app/utils/api";
import { useAuth } from "@/app/hooks/useAuth";

export function useChat() {
  const { userId, token } = useAuth();
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách phiên chat khi userId thay đổi
  useEffect(() => {
    if (!userId || !token) return;
    getChatSessions(userId, token).then(setChatSessions);
  }, [userId, token]);

  // Chọn phiên chat mới nhất
  useEffect(() => {
    if (!selectedSession && chatSessions.length > 0) {
      setSelectedSession(chatSessions[0].id);
    }
  }, [chatSessions]);

  // Tải tin nhắn khi chọn phiên chat mới
  useEffect(() => {
    if (!selectedSession || !token) return;
    getMessages(selectedSession, token).then(setMessages);
  }, [selectedSession, token]);

  // Gửi tin nhắn
  const sendMessage = async (text: string) => {
    let sessionId = selectedSession;
    if (!sessionId) {
      sessionId = await startNewChatSession(userId, token);
      if (!sessionId) return;
      setSelectedSession(sessionId);
    }

    // Lưu tin nhắn user vào DB và gọi chatbot
    setMessages((prev) => [...prev, { text, role: "user" }]);
    setIsLoading(true);

    const botResponse = await sendMessageToAPI(sessionId, text, token, "user");
    console.log("bot response: ", botResponse);

    if (botResponse) {
      setMessages((prev) => [
        ...prev,
        { text: botResponse, role: "assistant" },
      ]);

      // 🛠 Lưu tin nhắn của bot vào database
      await sendMessageToAPI(sessionId, botResponse, token, "assistant");
    }

    setIsLoading(false);
  };

  // 🆕 Thêm phiên chat mới
  const addNewChatSession = async () => {
    if (!userId || !token) return;

    const sessionId = await startNewChatSession(userId, token);
    if (!sessionId) return;

    const newSession = { id: sessionId, start_time: new Date().toISOString() };
    setChatSessions((prev) => [newSession, ...prev]); // Thêm vào danh sách
    setSelectedSession(sessionId); // Chọn ngay session mới
  };

  // 🆕 Xóa phiên chat
  const deleteChatSession = async (sessionId: number) => {
    if (!token) return;

    // ⚡ Cập nhật UI ngay lập tức bằng cách lọc bỏ session
    setChatSessions((prevSessions) => {
      const updatedSessions = prevSessions.filter((s) => s.id !== sessionId);

      // 🛠 Nếu đang xóa session đang chọn, chọn session khác hoặc set null
      if (selectedSession === sessionId) {
        setSelectedSession(
          updatedSessions.length > 0 ? updatedSessions[0].id : null
        );
      }

      return updatedSessions;
    });

    // 🛠 Xóa trên server
    await deleteChatSessionAPI(sessionId, token);

    console.log(`✅ Xóa session ${sessionId} thành công!`);
  };

  return {
    messages,
    chatSessions,
    selectedSession,
    isLoading,
    sendMessage,
    selectChatSession: setSelectedSession,
    addNewChatSession, // ✅ Thêm vào hook
    deleteChatSession,
  };
}
