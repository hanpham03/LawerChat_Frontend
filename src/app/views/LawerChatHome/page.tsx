"use client";
import { useEffect, useState } from "react";
import { PlusCircle, Trash, Send } from "lucide-react";
import { sendMessageToAPI } from "@/app/utils/api";
import { jwtDecode } from "jwt-decode";
import CustomMarkdown from "@/components/my_components/markdown";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Lấy user_id từ token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/chat-sessions/lawer/${userId}`
        );
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");

        const data = await response.json();
        const formattedHistory = data.map((session) => ({
          id: session.id,
          time: new Date(session.start_time).toLocaleString("vi-VN"),
        }));

        setHistory(formattedHistory);

        // Tự động chọn phiên chat mới nhất (đầu tiên trong mảng) khi tải xong lịch sử
        if (formattedHistory.length > 0 && !selectedSessionId) {
          const latestSessionId = formattedHistory[0].id;
          selectSession(latestSessionId);
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử chat:", error);
      }
    };

    fetchHistory();
  }, [userId]); // Chỉ phụ thuộc vào userId, không phụ thuộc vào selectedSessionId

  const selectSession = async (sessionId) => {
    setSelectedSessionId(sessionId);

    try {
      const response = await fetch(
        `http://localhost:3001/api/messages/lawerMessage/${sessionId}`
      );
      if (!response.ok) throw new Error("Lỗi khi tải tin nhắn");

      const data = await response.json();

      if (data.length === 0) {
        setMessages([]);
      } else {
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role === "user" ? "user" : "bot",
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    }
  };

  const createNewSession = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) {
      console.error("Không tìm thấy token hoặc userId");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/chat-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          chatbot_id: 86,
        }),
      });

      if (!response.ok) throw new Error("Lỗi khi tạo phiên chat");

      const data = await response.json();
      const sessionId = data.sessionId;

      setHistory((prevHistory) => [
        {
          id: sessionId,
          time: new Date().toLocaleString("vi-VN"),
        },
        ...prevHistory,
      ]);

      setSelectedSessionId(sessionId);
      setMessages([]);
    } catch (error) {
      console.error("Lỗi tạo phiên chat:", error);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!sessionId) {
      console.error("sessionId không hợp lệ");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa phiên chat này?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token");
      alert("Vui lòng đăng nhập lại để thực hiện thao tác này!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/chat-sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Lỗi khi xóa phiên chat: ${errorData.message || response.statusText}`
        );
      }

      setHistory((prevHistory) =>
        prevHistory.filter((s) => s.id !== sessionId)
      );
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Lỗi xóa phiên chat:", error);
      alert("Không thể xóa phiên chat. Vui lòng thử lại!");
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "" || !selectedSessionId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token");
      return;
    }

    const userMsgId = `${selectedSessionId}-user-${Date.now()}`;
    const newMessage = {
      id: userMsgId,
      text: input,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInput("");

    try {
      setIsLoading(true);
      const response = await sendMessageToAPI(
        selectedSessionId,
        input,
        token,
        "user"
      );

      if (response) {
        await sendMessageToAPI(selectedSessionId, response, token, "assistant");

        const botMsgId = `${selectedSessionId}-bot-${Date.now()}`;
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: botMsgId,
            text: response,
            sender: "bot",
          },
        ]);
      } else {
        console.error("Lỗi: Không nhận được phản hồi từ API");
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Lịch sử Chat */}
      <div className="w-[300px] bg-white border-r shadow-lg flex flex-col h-full max-h-screen overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🤖 Chatbot Tư Vấn Luật
          </h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50">
          <h3 className="font-semibold flex items-center gap-2 text-gray-700">
            📒 Lịch sử Chat
          </h3>
          <button
            className="flex items-center gap-1 text-white bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
            onClick={createNewSession}
          >
            <PlusCircle size={18} />
            Thêm
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-2 space-y-2 h-[500px] mb-[64px]">
          {history.length > 0 ? (
            history.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg flex items-center justify-between hover:bg-blue-100 transition-colors cursor-pointer ${
                  selectedSessionId === session.id
                    ? "bg-blue-200"
                    : "bg-blue-50"
                }`}
                onClick={() => selectSession(session.id)}
              >
                <span className="flex items-center gap-2">
                  💬 Phiên {session.id} - {session.time}
                </span>
                <button
                  className="text-white bg-red-500 p-1 rounded-full hover:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                >
                  <Trash size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Chưa có lịch sử chat.</p>
          )}
        </div>
      </div>

      {/* Khung Chat Chính */}
      {/* Chat window updated with CustomMarkdown */}
      <div className="w-[500px] flex-grow flex flex-col bg-white shadow-xl rounded-lg m-4">
        <div className="flex-grow p-6 overflow-y-auto space-y-4 mb-[64px] relative">
          {messages.length === 0 && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
              Chưa có tin nhắn nào
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={`message-${msg.id}`}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white"
                    : "bg-blue-50 text-gray-800 border border-blue-100"
                }`}
              >
                <CustomMarkdown>{msg.text}</CustomMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-2 rounded-xl shadow-sm bg-blue-50 text-gray-800 border border-blue-100">
                Đang phản hồi...
              </div>
            </div>
          )}
        </div>

        {/* Message input area remains the same */}
        <div className="p-4 border-t bg-white flex items-center sticky bottom-0">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-gray-50"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="ml-3 bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
            onClick={sendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
