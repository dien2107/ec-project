import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

export type Message = {
  from: "bot" | "me";
  text: string;
  timestamp?: Date;
};
type ChatMessagesProps = {
  messages: Message[];
};
export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex items-end gap-2 animate-fadeIn ${
            msg.from === "me" ? "justify-end" : "justify-start"
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          {msg.from === "bot" && (
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mb-1 shadow-sm">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
          )}
          
          <div className="flex flex-col max-w-[75%]">
            <div
              className={`px-4 py-2.5 rounded-2xl shadow-sm relative ${
                msg.from === "me"
                  ? "bg-blue-600 text-white rounded-br-md ml-auto"
                  : "bg-white border border-gray-200 rounded-bl-md shadow-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              {msg.from === "me" && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 rotate-45 transform"></div>
              )}
              {msg.from === "bot" && (
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45 transform"></div>
              )}
            </div>
            
            <div className={`text-xs text-gray-400 mt-1 px-1 ${
              msg.from === "me" ? "text-right" : "text-left"
            }`}>
              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 
               new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {msg.from === "me" && (
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mb-1 shadow-sm">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};