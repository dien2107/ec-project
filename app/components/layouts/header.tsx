import Navbar from "~/components/common/navbar";
import { Search, User, ShoppingBag } from "lucide-react";
import { Button } from "~/components/ui/button";
import Menu from "~/components/common/nav-menu";
import { Link } from "react-router";
import { useAppSelector, type RootState } from "~/redux/store";
import { useEffect } from "react";

const Header = () => {
  const cartCount = useAppSelector((state: RootState) => {
    console.log(state.cart.items);
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  });
  useEffect(() => {
    console.log("Cart count updated:", cartCount);
  }, [cartCount]);
  return (
    <header className="bg-[#363c41] w-full h-16 shadow-sm sticky top-0 z-50 border-b">
      <div className="main-container flex h-full items-center justify-between gap-8 px-6">
        <Link className="flex items-center" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 rounded-sm w-auto hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex-1 flex justify-center">
          <Navbar />
        </div>

        <div className="flex justify-end items-center gap-6 text-white">
          <Button className="p-2 rounded-full" variant={"icon"}>
            <Search size={20} />
          </Button>
          <Button className="p-2 rounded-full" variant={"icon"}>
            <User size={20} />
          </Button>
          <Link className="flex items-center" to="/cart">
            <Button className="p-2 rounded-full relative" variant={"icon"}>
              <ShoppingBag size={20} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Button>
          </Link>
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
