import { useState, useEffect, useRef } from "react";
import { Send, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chat({ messages, sendMessage, isLoading }) {
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText, "user");
      setInputText("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200">
      {/* Khu vực hiển thị tin nhắn */}
      <div className="border border-gray-300 rounded-xl p-4 h-[500px] overflow-y-auto bg-gray-50 shadow-inner flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`p-4 my-2 rounded-xl text-md max-w-[75%] shadow-md ${
              msg.role === "user"
                ? "bg-green-500 text-white self-end"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            {/* 📝 Hiển thị Markdown đẹp hơn */}
            <div className="prose max-w-none text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content || msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading animation */}
        {isLoading && (
          <div className="p-4 my-2 rounded-xl bg-gray-300 text-gray-900 self-start max-w-[75%] animate-pulse flex items-center gap-2 text-lg">
            <Loader className="w-5 h-5 animate-spin" /> Đang phản hồi...
          </div>
        )}

        {/* Tự động cuộn xuống tin nhắn mới nhất */}
        <div ref={chatEndRef} />
      </div>

      {/* Thanh nhập tin nhắn */}
      <div className="flex items-center gap-3 mt-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className="flex-grow p-3 border border-gray-300 rounded-xl shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <button
          onClick={handleSend}
          className={`bg-green-500 text-white p-4 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 text-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
