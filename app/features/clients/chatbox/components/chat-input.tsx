import { useState } from "react";
import { Send, Bot } from "lucide-react";

type ChatInputProps = {
  onSend: (msg: string) => void;
};

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {isTyping && (
        <div className="px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
          <Bot className="w-3 h-3" />
          <span>AI đang soạn tin nhắn</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform ${
            input.trim()
              ? "bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
