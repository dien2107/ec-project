// components/chat-header.tsx
import { X, Bot, Minimize2 } from "lucide-react";

type Props = {
  onClose: () => void;
  onMinimize: () => void;
};

export function ChatHeader({ onClose, onMinimize }: Props) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        <div>
          <span className="font-semibold text-sm">Stylist AI Tư Vấn</span>
          <div className="text-xs opacity-80">Đang hoạt động</div>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onMinimize}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}