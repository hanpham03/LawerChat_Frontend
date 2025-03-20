"use client";
import { useEffect, useState } from "react";
import { PlusCircle, Trash, Send } from "lucide-react";
import { sendMessageToAPI } from "@/app/utils/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null); // Lưu phiên chat được chọn
  const user_id = 11; // Giả sử user_id là 11, bạn có thể thay bằng biến động.

  // Lấy lịch sử chat
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/chat-sessions/lawer/${user_id}`
        );
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");

        const data = await response.json();
        const formattedHistory = data.map((session) => ({
          id: session.id,
          time: new Date(session.start_time).toLocaleString("vi-VN"),
        }));

        setHistory(formattedHistory);
      } catch (error) {
        console.error("Lỗi tải lịch sử chat:", error);
      }
    };

    fetchHistory();
  }, [user_id]);

  // Hàm chọn phiên chat & tải tin nhắn của phiên đó
  const selectSession = async (sessionId) => {
    setSelectedSessionId(sessionId);

    try {
      const response = await fetch(
        `http://localhost:3001/api/messages/lawerMessage/${sessionId}`
      );
      if (!response.ok) throw new Error("Lỗi khi tải tin nhắn");

      const data = await response.json();

      // Chuyển đổi dữ liệu sang định dạng messages
      const formattedMessages = data.map((msg) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === "user" ? "user" : "bot",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "" || !selectedSessionId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token");
      return;
    }

    // Hiển thị tin nhắn trên UI ngay lập tức
    const newMessage = { id: messages.length + 1, text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      const response = await sendMessageToAPI(
        selectedSessionId,
        input,
        token,
        "user"
      );

      if (response === null) {
        console.error("Lỗi: Không nhận được phản hồi từ API");
        return;
      }

      if (response) {
        // Lưu tin nhắn chatbot vào database
        await sendMessageToAPI(selectedSessionId, response, token, "assistant");

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: response, sender: "bot" },
        ]);
      } else {
        console.error("Lỗi: Không nhận được phản hồi từ API");
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Lịch sử Chat */}
      <div className="w-[300px] bg-white border-r shadow-lg flex flex-col h-full max-h-screen overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🤖 Chatbot
          </h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50">
          <h3 className="font-semibold flex items-center gap-2 text-gray-700">
            📒 Lịch sử Chat
          </h3>
          <button className="flex items-center gap-1 text-white bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
            <PlusCircle size={18} />
            Thêm
          </button>
        </div>
        {/* Đặt chiều cao cố định và cuộn khi nội dung dài */}
        <div className="flex-grow overflow-y-auto p-2 space-y-2 h-[500px]">
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
                <button className="text-white bg-red-500 p-1 rounded-full hover:bg-red-600 transition-colors">
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
      <div className="w-[500px] flex-grow flex flex-col bg-white shadow-xl rounded-lg m-4">
        <div className="flex-grow p-6 overflow-y-auto space-y-4 mb-[64px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
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
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* 📌 Khung nhập tin nhắn */}
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
