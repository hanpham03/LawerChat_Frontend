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
    <div className="flex h-screen overflow-hidden">
      {/* Phần chat chính, dùng flex để kéo dãn */}
      <div className="flex-grow flex flex-col">
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Sidebar lịch sử chat, đảm bảo chiều cao vừa khớp */}
      <div className="w-1/4 bg-gray-100 border-l flex flex-col h-full">
        <ChatHistory
          chatSessions={chatSessions}
          selectChatSession={selectChatSession}
          selectedSession={selectedSession}
          addNewChatSession={addNewChatSession}
          deleteChatSession={deleteChatSession}
        />
      </div>
    </div>
  );
}
