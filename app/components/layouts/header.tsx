import Navbar from "~/components/common/navbar";
import { Search, User, ShoppingBag } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#363c41] w-full h-16 shadow-sm sticky top-0 z-50 border-b">
      <div className="main-container flex h-full items-center justify-between gap-8 px-6">
        <div className="flex items-center">
          <img
            src="/logo-test.png"
            alt="Logo"
            className="h-8 w-auto hover:opacity-80 transition-opacity"
          />
        </div>

        <div className="flex-1 flex justify-center">
          <Navbar />
        </div>

        <div className="flex justify-end items-center gap-6 text-white">
          <button className="p-2 rounded-full">
            <Search className="cursor-pointer" size={20} />
          </button>
          <button className="p-2 rounded-full">
            <User className="cursor-pointer" size={20} />
          </button>
          <button className="p-2 rounded-full relative">
            <ShoppingBag className="cursor-pointer" size={20} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;