"use client";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  FilePlus,
  X,
  SendHorizonal,
  MessageCircle,
  CircleUser,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import CustomMarkdown from "@/components/my_components/markdown";

// Define TypeScript interfaces for proper typing
interface ChatSession {
  id: number;
  time: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface JwtPayloadExtended {
  id: number;
  [key: string]: unknown;
}

interface SessionData {
  id: number;
  start_time: string;
  user_id: number;
  chatbot_id: number;
}

interface MessageData {
  id: string;
  session_id: number;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}
=======
import { PlusCircle, Trash, Send } from "lucide-react";
import { sendMessageToAPI } from "@/app/utils/api";
import { jwtDecode } from "jwt-decode";
import CustomMarkdown from "@/components/my_components/markdown";
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
<<<<<<< HEAD
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );
  const [userId, setUserId] = useState<number | null>(null);
=======
  const [history, setHistory] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Lấy user_id từ token
    const token = localStorage.getItem("token");
    if (token) {
      try {
<<<<<<< HEAD
        const decoded = jwtDecode<JwtPayloadExtended>(token);
=======
        const decoded = jwtDecode(token);
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
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
        const formattedHistory = data.map((session: SessionData) => ({
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
<<<<<<< HEAD
  }, [userId, selectedSessionId]); // Thêm selectedSessionId để refresh khi cần

  const selectSession = async (sessionId: number) => {
=======
  }, [userId]); // Chỉ phụ thuộc vào userId, không phụ thuộc vào selectedSessionId

  const selectSession = async (sessionId) => {
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
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
<<<<<<< HEAD
        const formattedMessages = data.map((msg: MessageData) => ({
=======
        const formattedMessages = data.map((msg) => ({
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
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

<<<<<<< HEAD
  const deleteSession = async (sessionId: number) => {
=======
  const deleteSession = async (sessionId) => {
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
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

    const userMsgId = `${selectedSessionId}-user-${Date.now()}`;
    const newMessage: ChatMessage = {
      id: userMsgId,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token trong localStorage");
      return;
    }

<<<<<<< HEAD
    // Lưu tin nhắn của người dùng vào database
    try {
      await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: selectedSessionId,
          content: input,
          role: "user",
        }),
      });
    } catch (error) {
      console.error("Lỗi khi lưu tin nhắn người dùng vào database:", error);
    }

=======
    const userMsgId = `${selectedSessionId}-user-${Date.now()}`;
    const newMessage = {
      id: userMsgId,
      text: input,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
    setInput("");
    setIsLoading(true);

    try {
<<<<<<< HEAD
      const response = await fetch("http://localhost/v1/chat-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer app-Y4xWP5vos8N9Ut1DcujkWbUz",
        },
        body: JSON.stringify({
          inputs: {},
          query: input,
          response_mode: "streaming",
          user: "abc-123",
        }),
      });

      if (!response.body) {
        throw new Error("Phản hồi không chứa stream dữ liệu.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let answer = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const jsonString = line.replace("data: ", "").trim();
            if (!jsonString || jsonString === "[DONE]") continue;

            buffer += jsonString;

            try {
              const dataJson = JSON.parse(buffer);
              if (dataJson.event === "workflow_finished") {
                answer = dataJson.data?.outputs?.answer || "";
              }
              buffer = "";
            } catch (err) {
              console.error(
                "Lỗi phân tích JSON từ stream:",
                err,
                "Chuỗi JSON:",
                buffer
              );
            }
          }
        }
      }
      console.log(answer);

      if (answer) {
        const botMsgId = `${selectedSessionId}-bot-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            text: answer,
=======
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
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
            sender: "bot",
          },
        ]);

        // Lưu tin nhắn của chatbot vào database
        try {
          await fetch("http://localhost:3001/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              session_id: selectedSessionId,
              content: answer,
              role: "assistant",
            }),
          });
        } catch (error) {
          console.error("Lỗi khi lưu tin nhắn chatbot vào database:", error);
        }
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("Lỗi khi gửi hoặc xử lý phản hồi:", error);
=======
      console.error("Lỗi gửi tin nhắn:", error);
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content - takes remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 h-full shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" /> Lịch sử hội
              thoại
            </h3>
            <button
              className="flex items-center gap-1.5 text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              onClick={createNewSession}
            >
              <FilePlus size={16} />
              <span className="text-sm font-medium">Tạo mới</span>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto py-4 px-3 space-y-2.5 bg-gray-50">
            {history.length > 0 ? (
              history.map((session) => (
                <div
                  key={session.id}
                  className={`p-3.5 rounded-xl flex items-center justify-between hover:bg-blue-50 transition-all cursor-pointer ${
                    selectedSessionId === session.id
                      ? "bg-blue-100 border-l-4 border-blue-600 shadow-md"
                      : "bg-white border border-gray-200 hover:shadow-sm"
                  }`}
                  onClick={() => selectSession(session.id)}
                >
                  <span className="flex items-center gap-2 text-gray-700 truncate">
                    <MessageCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="truncate font-medium">
                      Phiên tư vấn {session.time}
                    </span>
                  </span>
                  <button
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <MessageCircle className="h-12 w-12 text-blue-500" />
                </div>
                <p className="text-center mb-3 text-gray-600 font-medium">
                  Chưa có cuộc hội thoại nào
                </p>
                <button
                  onClick={createNewSession}
                  className="mt-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm shadow-sm"
                >
                  <FilePlus size={16} />
                  Bắt đầu hội thoại đầu tiên
=======
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
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
                </button>
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Chat Area - Flexible width */}
        <div className="flex-grow flex flex-col bg-white h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-10 w-10 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <MessageCircle className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Chatbot Tư Vấn Luật
                </h3>
                {selectedSessionId && (
                  <p className="text-sm text-gray-500">
                    Phiên tư vấn #{selectedSessionId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-grow p-6 overflow-y-auto space-y-5 bg-gray-50">
            {messages.length === 0 && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="bg-blue-50 p-5 rounded-full mb-5">
                  <MessageCircle className="h-16 w-16 text-blue-400" />
                </div>
                <p className="text-xl mb-3 font-medium text-gray-700">
                  Hãy bắt đầu cuộc hội thoại
                </p>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  Đặt câu hỏi về các vấn đề pháp lý để được hỗ trợ tư vấn nhanh
                  chóng
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={`message-${msg.id}`}
                  className={`flex items-start gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== "user" && (
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <MessageCircle className="h-5 w-5 text-blue-700" />
                    </div>
                  )}

                  <div
                    className={`px-5 py-3.5 rounded-2xl shadow-sm max-w-[75%] ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <CustomMarkdown>{msg.text}</CustomMarkdown>
                  </div>

                  {msg.sender === "user" && (
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <CircleUser className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <MessageCircle className="h-5 w-5 text-blue-700" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-gray-200 bg-white mb-[64px]">
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all">
              <input
                type="text"
                className="flex-grow p-3.5 outline-none bg-transparent"
                placeholder="Nhập câu hỏi pháp lý của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={!selectedSessionId}
              />
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 m-1.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || !selectedSessionId}
              >
                <SendHorizonal size={18} />
              </button>
            </div>
            {!selectedSessionId && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Vui lòng chọn hoặc tạo mới một phiên chat để bắt đầu
              </p>
            )}
          </div>
=======
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
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
        </div>
      </div>
    </div>
  );
}
