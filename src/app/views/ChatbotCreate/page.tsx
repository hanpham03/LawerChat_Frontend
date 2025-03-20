import ChatbotForm from "./ChatbotForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; // Thư viện icon lucide-react

export default function CreateChatbotPage() {
  return (
    <div className="relative">
      {" "}
      {/* Đảm bảo cha có position để đặt link tuyệt đối */}
      <ChatbotForm />
      {/* Đặt link ở góc trái bên trên */}
      <div className="absolute top-2 left-4">
        <Link
          href="/views/ChatbotLists"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-blue-500 text-blue-500 
             rounded hover:bg-blue-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại DS Chatbot
        </Link>
      </div>
    </div>
  );
}
