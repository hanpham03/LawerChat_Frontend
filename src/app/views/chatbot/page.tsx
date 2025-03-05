import ChatbotForm from "./ChatbotForm";
import Link from "next/link";

export default function CreateChatbotPage() {
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6 text-center">Tạo Chatbot</h1> */}
      <ChatbotForm />
      <div className="text-center mt-4">
        <Link href="/views/home" className="text-blue-500 hover:underline">
          Quay lại danh sách Chatbot
        </Link>
      </div>
    </div>
  );
}
