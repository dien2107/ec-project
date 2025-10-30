import {
  Search,
  User,
  ShoppingBag,
  Menu as MenuIcon,
  ChevronDown,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { useAppSelector, type RootState } from "~/redux/store";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

const menuItems = [
  {
    name: "SALE",
    path: "/sale",
    dropdown: [
      { name: "Áo Sale", path: "/sale/ao" },
      { name: "Quần Sale", path: "/sale/quan" },
      { name: "Phụ kiện Sale", path: "/sale/phu-kien" },
    ],
  },
  {
    name: "GU",
    path: "/gu",
    dropdown: [
      { name: "Minimalist", path: "/gu/minimalist" },
      { name: "Streetwear", path: "/gu/streetwear" },
      { name: "Vintage", path: "/gu/vintage" },
      { name: "Korean Style", path: "/gu/korean" },
    ],
  },
  {
    name: "ÁO",
    path: "/ao",
    dropdown: [
      { name: "Áo Thun", path: "/ao/ao-thun" },
      { name: "Áo Polo", path: "/ao/ao-polo" },
      { name: "Áo Sơ Mi", path: "/ao/ao-so-mi" },
      { name: "Áo Hoodie", path: "/ao/ao-hoodie" },
      { name: "Áo Khoác", path: "/ao/ao-khoac" },
      { name: "Áo Sweater", path: "/ao/ao-sweater" },
    ],
  },
  {
    name: "QUẦN",
    path: "/quan",
    dropdown: [
      { name: "Quần Jean", path: "/quan/quan-jean" },
      { name: "Quần Kaki", path: "/quan/quan-kaki" },
      { name: "Quần Short", path: "/quan/quan-short" },
      { name: "Quần Jogger", path: "/quan/quan-jogger" },
    ],
  },
  {
    name: "PHỤ KIỆN",
    path: "/phu-kien",
    dropdown: [
      { name: "Túi Xách", path: "/phu-kien/tui-xach" },
      { name: "Mũ Nón", path: "/phu-kien/mu-non" },
      { name: "Ví", path: "/phu-kien/vi" },
      { name: "Thắt Lưng", path: "/phu-kien/that-lung" },
    ],
  },
  {
    name: "MỚI",
    path: "/moi",
    dropdown: [
      { name: "Bộ Sưu Tập Mới", path: "/moi/bo-suu-tap-moi" },
      { name: "Sản Phẩm Hot", path: "/moi/san-pham-hot" },
    ],
  },
  {
    name: "CỬA HÀNG",
    path: "/cua-hang",
  },
  {
    name: "VIP",
    path: "/vip",
    dropdown: [
      { name: "Đăng ký VIP", path: "/vip/dang-ky" },
      { name: "Ưu đãi VIP", path: "/vip/uu-dai" },
    ],
  },
];

const Header = () => {
  const cartCount = useAppSelector((state: RootState) => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-white w-full h-16 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="MEYA Logo"
              className="h-10 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Menu - Center */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2"
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 animate-in fade-in slide-in-from-top-2">
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link
                          to={subItem.path}
                          className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5 text-gray-700" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5 text-gray-700" />
            </Button>
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex relative"
              >
                <ShoppingBag className="h-5 w-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-96 overflow-y-auto"
              >
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <Search className="h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="flex-1 outline-none text-sm"
                    />
                  </div>

                  {/* Mobile Menu Items */}
                  {menuItems.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <Link
                        to={item.path}
                        className="block text-base font-medium text-gray-900 hover:text-gray-600"
                        onClick={() =>
                          !item.dropdown && setIsMobileMenuOpen(false)
                        }
                      >
                        {item.name}
                      </Link>
                      {item.dropdown && (
                        <div className="pl-4 space-y-2">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="block text-sm text-gray-600 hover:text-gray-900"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Mobile Bottom Actions */}
                  <div className="pt-4 border-t space-y-3">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">Tài khoản</span>
                    </Link>
                    <Link
                      to="/cart"
                      className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Giỏ hàng ({cartCount})
                      </span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
