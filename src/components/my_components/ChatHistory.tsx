"use client";

import { FaPlus, FaTrash, FaCommentDots } from "react-icons/fa";

interface ChatSession {
  id: number;
  start_time: string;
  chatbot_id: number; // Thêm thuộc tính chatbot_id để lọc đúng chatbot
  user_id: number;
}

interface ChatbotInfo {
  id: number;
  user_id: number;
  name: string;
  description: string;
  dify_chatbot_id: string;
}

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  selectChatSession: (sessionId: number) => void;
  selectedSession: number | null;
  addNewChatSession: () => void;
  deleteChatSession: (sessionId: number) => void;
  chatbotInfo: ChatbotInfo | null;
}

export default function ChatHistory({
  chatSessions,
  selectChatSession,
  selectedSession,
  addNewChatSession,
  deleteChatSession,
  chatbotInfo,
}: ChatHistoryProps) {
  // ✅ Lọc chỉ những phiên chat thuộc chatbot hiện tại & đúng user
  const filteredSessions = chatSessions.filter(
    (session) =>
      chatbotInfo &&
      session.chatbot_id === chatbotInfo.id &&
      session.user_id === chatbotInfo.user_id
  );

  return (
    <div
      className="border-l bg-gray-50 flex flex-col shadow-lg rounded-lg"
      style={{ height: "calc(90vh - 64px)" }}
    >
      {/* Tên Chatbot */}
      <div className="p-2 text-center bg-blue-100 text-blue-800 font-semibold">
        🤖 {chatbotInfo ? chatbotInfo.name : "LawerChat"}
      </div>

      {/* Tiêu đề + Nút Thêm */}
      <div className="p-4 flex justify-between items-center bg-white shadow-sm border-b">
        <h2 className="m-3 text-lg font-semibold text-gray-700 flex items-center">
          🗂️ Lịch sử Chat
        </h2>
        <button
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={addNewChatSession}
        >
          <FaPlus />
          Thêm
        </button>
      </div>

      {/* Danh sách phiên chat */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredSessions.length === 0 ? (
          <p className="text-gray-500 text-center italic mt-4">
            Chưa có lịch sử chat.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredSessions
              .sort(
                (a, b) =>
                  new Date(b.start_time).getTime() -
                  new Date(a.start_time).getTime()
              )
              .map((session) => (
                <div
                  key={session.id}
                  className={`flex justify-between items-center p-4 rounded-lg transition duration-200 shadow-md border cursor-pointer ${
                    selectedSession === session.id
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => selectChatSession(session.id)}
                >
                  {/* Nội dung phiên chat */}
                  <div className="flex items-center gap-3">
                    <FaCommentDots
                      className={`text-lg ${
                        selectedSession === session.id
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                    <div>
                      <span className="font-semibold">Phiên {session.id}</span>
                      <br />
                      <span
                        className={`text-sm ${
                          selectedSession === session.id
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(session.start_time).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Nút Xóa */}
                  <button
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatSession(session.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
