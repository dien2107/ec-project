import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatMessages, type Message } from "./components/chat-messenges";
import { ChatHeader } from "./components/chat-header";
import { ChatInput } from "./components/chat-input";

const Chatbox = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Chào bạn! 👋 Mình là AI Stylist, sẵn sàng hỗ trợ bạn về thời trang và phong cách.",
      timestamp: new Date(),
    },
    {
      from: "bot",
      text: "Bạn có thể chia sẻ với mình về sở thích thời trang hoặc bất kỳ vấn đề nào bạn đang gặp phải không?",
      timestamp: new Date(),
    },
  ]);

  const handleSend = (msg: string) => {
    const newMessage: Message = {
      from: "me",
      text: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Cảm ơn bạn đã chia sẻ! Mình hiểu vấn đề của bạn.",
        "Đó là một câu hỏi thú vị! Để mình tư vấn cho bạn...",
        "Mình sẽ giúp bạn giải quyết vấn đề này ngay!",
        "Thật tuyệt! Mình có một số gợi ý cho bạn.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: randomResponse,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .chat-shadow {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-slideUp"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
          </button>
        )}

        {open && (
          <div
            className={`chat-shadow rounded-3xl overflow-hidden bg-white transition-all duration-300 animate-slideUp ${
              minimized ? "w-80 h-16" : "w-96 h-[32rem]"
            }`}
          >
            <div className="flex flex-col h-full">
              <ChatHeader
                onClose={() => setOpen(false)}
                onMinimize={() => setMinimized(!minimized)}
              />

              {!minimized && (
                <>
                  <div className="flex-1 flex flex-col min-h-0">
                    <ChatMessages messages={messages} />
                  </div>
                  <ChatInput onSend={handleSend} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbox;
