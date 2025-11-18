import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { ChatMessages, type Message } from "./components/chat-messenges";
import { ChatHeader } from "./components/chat-header";
import { ChatInput } from "./components/chat-input";
import { Button } from "~/components/ui/button";
import io, { type Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { safeLocalStorage } from "~/helper/safeLocalStorage";
const Chatbox = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let sessionId = safeLocalStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = uuidv4();
      safeLocalStorage.setItem("chat_session_id", sessionId);
    }

    socketRef.current = io(import.meta.env.VITE_API_CHATBOX_URL, {
      auth: { sessionId },
    });

    const handleServerMsg = (msg: Message) => {
      console.log(msg);
      if (msg.success === false) {
        setIsTyping(true);
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false);
      }
      // New session
      else if (msg.isNewSession) {
        setIsTyping(true);
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false);
      }
      // Continue session (reload chat history)
      else if (msg.chatHistory && msg.chatHistory.length > 0) {
        setIsTyping(true);
        setMessages(msg.chatHistory);
        setIsTyping(false);
      }
      // Continue session (normal message)
      else {
        setIsTyping(true);
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false);
      }
    };

    socketRef.current?.on("server_message", handleServerMsg);

    return () => {
      socketRef.current?.off("server_message", handleServerMsg);
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSend = (msg: string) => {
    const newMessage: Message = {
      from: "me",
      text: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    setIsTyping(true);

    // Check if socket isn't connected
    if (!socketRef.current) {
      const errorMsg: Message = {
        from: "bot",
        text: "Lỗi kết nối. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsTyping(false);
      return;
    }

    socketRef.current.emit("client_message", newMessage);
  };

  return (
    <>
      <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6">
        {!open && (
          <Button
            onClick={() => setOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-slideUp"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
          </Button>
        )}

        {open && (
          <div
            className={`chat-shadow rounded-3xl overflow-hidden bg-white transition-all duration-300 animate-slideUp
              fixed left-1/2 -translate-x-1/2 bottom-4
              sm:relative sm:left-auto sm:translate-x-0 sm:bottom-auto
              shadow-lg border-0 ring-0 focus:outline-none
              ${
                minimized
                  ? "max-w-[90vw] w-[90vw] sm:w-80 h-16"
                  : "max-w-[90vw] w-[90vw] sm:w-96 sm:p-0"
              }
              ${!minimized ? "h-[70vh] md:h-[60vh] lg:h-[32rem] max-h-[90vh]" : ""}
              `}
          >
            <div className="flex flex-col h-full  ">
              <ChatHeader
                onClose={() => setOpen(false)}
                onMinimize={() => setMinimized(!minimized)}
              />

              {!minimized && (
                <>
                  <div className="flex-1 flex flex-col min-h-0">
                    <ChatMessages messages={messages} />
                  </div>
                  <div className="px-2 sm:px-0 pb-2 sm:pb-0">
                    <ChatInput onSend={handleSend} isTyping={isTyping} />
                  </div>
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
