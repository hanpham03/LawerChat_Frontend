"use client";
import { useChat } from "@/app/hooks/useChat";
import Chat from "@/components/my_components/chat";
import ChatHistory from "@/components/my_components/ChatHistory";

export default function Home() {
  const {
    messages,
    chatSessions,
    selectedSession,
    isLoading,
    sendMessage,
    selectChatSession,
    deleteChatSession,
    addNewChatSession,
  } = useChat();

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Sidebar lịch sử chat (bên trái) */}
      <div className="w-1.5/5 bg-white border-r flex flex-col h-full p-4 shadow-lg overflow-y-auto">
        <ChatHistory
          chatSessions={chatSessions}
          selectChatSession={selectChatSession}
          selectedSession={selectedSession}
          addNewChatSession={addNewChatSession}
          deleteChatSession={deleteChatSession}
        />
      </div>

      {/* Phần chat chính (bên phải) */}
      <div className="flex-grow flex flex-col p-6 bg-white shadow-lg rounded-lg">
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
