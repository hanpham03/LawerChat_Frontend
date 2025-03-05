"use client";

interface ChatSession {
  id: number;
  start_time: string;
}

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  selectChatSession: (sessionId: number) => void;
  selectedSession: number | null;
  addNewChatSession: () => void;
  deleteChatSession: (sessionId: number) => void;
}

export default function ChatHistory({
  chatSessions,
  selectChatSession,
  selectedSession,
  addNewChatSession,
  deleteChatSession,
}: ChatHistoryProps) {
  return (
    // Dùng calc(100vh - 64px) để trừ chiều cao header
    <div
      className="border-l bg-gray-100 flex flex-col"
      style={{ height: "calc(90vh - 64px)" }}
    >
      {/* Khu vực tiêu đề + nút thêm (cố định ở trên) */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-700">🗂️ Lịch sử Chat</h2>
          <button
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow"
            onClick={addNewChatSession}
          >
            ➕ Thêm
          </button>
        </div>
      </div>

      {/* Khu vực danh sách phiên chat (cuộn bên trong khung này) */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {chatSessions.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            Chưa có lịch sử chat.
          </p>
        ) : (
          <div className="space-y-2">
            {chatSessions
              .sort(
                (a, b) =>
                  new Date(b.start_time).getTime() -
                  new Date(a.start_time).getTime()
              )
              .map((session) => (
                <div
                  key={session.id}
                  className={`flex justify-between items-center p-3 rounded-lg transition duration-200 shadow ${
                    selectedSession === session.id
                      ? "bg-green-500 text-white"
                      : "bg-white hover:bg-gray-200"
                  }`}
                >
                  {/* Nội dung phiên chat */}
                  <button
                    className="flex-1 text-left"
                    onClick={() => selectChatSession(session.id)}
                  >
                    <span className="font-semibold">📝 Phiên {session.id}</span>
                    <br />
                    <span
                      className={`text-sm ${
                        selectedSession === session.id
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {new Date(session.start_time).toLocaleString()}
                    </span>
                  </button>

                  {/* Nút xóa */}
                  <button
                    className="px-2 py-1 bg-white-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                    onClick={() => deleteChatSession(session.id)}
                  >
                    ❌
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
