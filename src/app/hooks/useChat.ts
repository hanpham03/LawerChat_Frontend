import { useEffect, useState } from "react";
import {
  getChatSessions,
  getMessages,
  sendMessageToAPI,
  startNewChatSession,
  deleteChatSessionAPI,
  deleteChatbotUser,
} from "@/app/utils/api";
import { useAuth } from "@/app/hooks/useAuth";
import { useSearchParams } from "next/navigation";

export function useChat() {
  const { userId, token } = useAuth();
  const searchParams = useSearchParams();
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Cập nhật chatbotId khi URL thay đổi
  useEffect(() => {
    setChatbotId(searchParams.get("chatbotId"));
  }, [searchParams]);

  // 🔹 Chỉ lấy phiên chat của chatbot hiện tại
  useEffect(() => {
    if (!userId || !token || !chatbotId) return;

    getChatSessions(userId, token, chatbotId)
      .then((sessions) => {
        setChatSessions([...sessions]); // ✅ Sao chép mảng để đảm bảo re-render
      })
      .catch((error) => console.error("Lỗi lấy danh sách phiên chat:", error));
  }, [userId, token, chatbotId]);

  // 🔹 Khi danh sách phiên chat thay đổi, chọn phiên mới nhất
  useEffect(() => {
    if (chatSessions.length > 0) {
      // 🔹 Chọn phiên chat có ID lớn nhất (mới nhất)
      const latestSession = chatSessions.reduce((prev, curr) =>
        prev.id > curr.id ? prev : curr
      );
      setSelectedSession(latestSession.id);
    }
  }, [chatSessions]);

  // 🔹 Khi chọn phiên chat, tải tin nhắn tương ứng
  useEffect(() => {
    if (!selectedSession || !token) return;

    getMessages(selectedSession, token)
      .then(setMessages)
      .catch((error) => console.error("Lỗi lấy tin nhắn:", error));
  }, [selectedSession, token]);

  // ✉️ Gửi tin nhắn
  const sendMessage = async (text: string, dify_chatbot_id?: string) => {
    let sessionId = selectedSession;

    if (!sessionId) {
      sessionId = await startNewChatSession(userId, token, chatbotId);
      if (!sessionId) return;
      setSelectedSession(sessionId);
    }

    setMessages((prev) => [...prev, { text, role: "user" }]);
    setIsLoading(true);

    try {
      console.log("📤 Gửi tin nhắn:", text);
      console.log("📌 dify_chatbot_id:", dify_chatbot_id);

      const botResponse = await sendMessageToAPI(
        sessionId,
        text,
        token,
        "user",
        dify_chatbot_id || chatbotId // ✅ Nếu không có `dify_chatbot_id`, dùng `chatbotId`
      );

      if (botResponse) {
        setMessages((prev) => [
          ...prev,
          { text: botResponse, role: "assistant" },
        ]);
        await sendMessageToAPI(sessionId, botResponse, token, "assistant");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi tin nhắn:", error);
    }

    setIsLoading(false);
  };

  // ➕ Thêm phiên chat mới
  const addNewChatSession = async () => {
    if (!userId || !token || !chatbotId) {
      alert("❌ Thiếu thông tin để tạo phiên chat mới.");
      return;
    }

    const sessionId = await startNewChatSession(userId, token, chatbotId);
    if (!sessionId) return;

    const newSession = {
      id: sessionId,
      chatbot_id: chatbotId,
      user_id: userId,
      start_time: new Date().toISOString(),
    };

    // ✅ Cập nhật state ngay lập tức
    setChatSessions((prev) => [newSession, ...prev]);
    setSelectedSession(sessionId);

    // ✅ Gọi API để đồng bộ danh sách chat mới nhất
    try {
      const updatedSessions = await getChatSessions(userId, token, chatbotId);
      setChatSessions(updatedSessions);
    } catch (error) {
      console.error("Lỗi cập nhật danh sách phiên chat:", error);
    }
  };

  // ❌ Xóa phiên chat
  const deleteChatSession = async (sessionId: number) => {
    if (!token) return;

    setChatSessions((prevSessions) => {
      const updatedSessions = prevSessions.filter((s) => s.id !== sessionId);

      if (selectedSession === sessionId) {
        setSelectedSession(
          updatedSessions.length > 0 ? updatedSessions[0].id : null
        );
      }

      return [...updatedSessions]; // ✅ Sao chép mảng để React nhận ra thay đổi
    });

    try {
      await deleteChatSessionAPI(sessionId, token);
      console.log(`✅ Xóa session ${sessionId} thành công!`);
    } catch (error) {
      console.error("Lỗi xóa phiên chat:", error);
    }
  };

  // reset messages
  const resetMessages = () => {
    setMessages([]);
  };

  const deleteChatbot = async (
    chatbotId: number,
    dify_chatbot_id: string,
    token: string
  ) => {
    if (!chatbotId || !dify_chatbot_id || !token) {
      console.error("❌ Thiếu thông tin để xóa chatbot.");
      return;
    }

    try {
      // Gọi API để xóa chatbot
      const response = await deleteChatbotUser(
        chatbotId,
        dify_chatbot_id,
        token
      );

      if (response?.message === "Chatbot deleted successfully") {
        console.log(`✅ Chatbot ${chatbotId} đã được xóa thành công!`);

        // Cập nhật lại danh sách chatbot sau khi xóa
        setChatSessions((prevSessions) =>
          prevSessions.filter((s) => s.chatbot_id !== chatbotId)
        );

        // Nếu chatbot bị xóa là chatbot đang được chọn, reset state
        if (chatbotId === selectedSession) {
          setSelectedSession(null);
          setMessages([]);
        }
      } else {
        console.error("⚠️ Không thể xóa chatbot:", response);
      }
    } catch (error) {
      console.error("🚨 Lỗi khi xóa chatbot:", error);
    }
  };

  return {
    messages,
    chatSessions,
    selectedSession,
    isLoading,
    sendMessage,
    selectChatSession: setSelectedSession,
    addNewChatSession,
    deleteChatSession,
    resetMessages,
    deleteChatbot,
  };
}
