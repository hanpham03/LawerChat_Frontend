import { useState, useEffect, useRef } from "react";
import { Send, Loader, PaperclipIcon, Smile } from "lucide-react";
import { motion } from "framer-motion";
import CustomMarkdown from "./markdown";

interface Message {
  id?: number;
  role: string;
  content?: string;
  text?: string;
}

interface ChatProps {
  messages: Message[];
  sendMessage: (message: string, dify_chatbot_id?: string) => void;
  isLoading: boolean;
  dify_chatbot_id: string;
}

export default function Chat({
  messages,
  sendMessage,
  isLoading,
  dify_chatbot_id,
}: ChatProps) {
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText, dify_chatbot_id);
      setInputText("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-5 w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 relative overflow-hidden">
      {/* Gradient background design element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl z-0"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-green-400/20 to-cyan-500/20 rounded-full blur-2xl z-0"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
            L
          </div>
          <div>
            <h3 className="font-bold text-gray-800">LawerChat</h3>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="relative z-10 border border-gray-200 rounded-xl p-4 h-[500px] overflow-y-auto bg-gray-50/80 backdrop-blur-sm shadow-inner flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Send className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-center">Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        )}

        {messages.map((msg: Message, index: number) => (
          <motion.div
            key={msg.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-2xl text-md max-w-[80%] shadow-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-white border border-gray-100 text-gray-800"
              } ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
            >
              <div
                className={`prose max-w-none ${
                  msg.role === "user" ? "text-white" : "text-gray-800"
                }`}
              >
                <CustomMarkdown>
                  {String(msg.content || msg.text || "")}
                </CustomMarkdown>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Loading animation */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="self-start"
          >
            <div className="p-4 rounded-2xl rounded-tl-sm bg-white border border-gray-100 text-gray-800 flex items-center gap-2">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-4 relative z-10">
        <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
          <button
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon className="w-5 h-5" />
            <input type="file" ref={fileInputRef} className="hidden" />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="flex-grow p-2 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-700"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />

          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Smile className="w-5 h-5" />
          </button>

          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className={`p-2 rounded-full transition-all duration-200 ${
              inputText.trim() && !isLoading
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
