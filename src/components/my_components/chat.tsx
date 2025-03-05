import { useState, useEffect, useRef } from "react";
import { Send, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    <div className="p-6 w-full max-w-3xl mx-auto bg-gray-100 rounded-2xl shadow-lg border">
      {/* Khung tin nhắn */}
      <div className="border border-gray-300 rounded-2xl mb-4 p-4 h-[500px] overflow-y-auto bg-white shadow-inner flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`p-4 my-2 rounded-lg text-md max-w-[80%] shadow-md ${
              msg.role === "user"
                ? "bg-green-500 text-white self-end"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            {/* Hiển thị Markdown dưới dạng HTML */}
            <ReactMarkdown>{msg.content || msg.text}</ReactMarkdown>
          </div>
        ))}

        {/* Hiệu ứng loading */}
        {isLoading && (
          <div className="p-4 my-2 rounded-lg bg-gray-300 text-gray-900 self-start max-w-[80%] animate-pulse flex items-center gap-2 text-lg">
            <Loader className="w-5 h-5 animate-spin" /> Đang phản hồi...
          </div>
        )}

        {/* Cuộn xuống khi có tin nhắn mới */}
        <div ref={chatEndRef} />
      </div>

      {/* Thanh nhập tin nhắn */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className="flex-grow p-3 border border-gray-300 rounded-2xl shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <button
          onClick={handleSend}
          className={`bg-green-500 text-white p-4 rounded-2xl shadow-md transition-all duration-200 flex items-center gap-2 text-lg ${
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
