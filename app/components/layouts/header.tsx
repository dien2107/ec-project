import {
  Search,
  User,
  ShoppingBag,
  Menu as MenuIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "~/redux/store";
import { useEffect, useState, useMemo, use } from "react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import SearchBar from "~/components/common/search-bar";
import type { Category } from "~/types/home-page";
import { fetchCurrentUser } from "~/redux/slices/auth";
import { fetchCart } from "~/redux/slices/cartSlice";

type MenuItem = {
  name: string;
  path: string;
  dropdown?: MenuItem[];
};

// Hàm chuyển đổi dữ liệu category từ API thành MenuItem
const convertCategoryToMenuItem = (category: Category): MenuItem => {
  const menuItem: MenuItem = {
    name: category.name,
    path: `/categories/${category.slug}`,
  };

  // Nếu có children (cấp 2), thêm vào dropdown
  if (category.children && category.children.length > 0) {
    menuItem.dropdown = category.children.map(child => {
      const childItem: MenuItem = {
        name: child.name,
        path: `/categories/${child.slug}`,
      };

      // Nếu child có children (cấp 3), thêm vào dropdown của child
      if (child.children && child.children.length > 0) {
        childItem.dropdown = child.children.map(grandChild => ({
          name: grandChild.name,
          path: `/categories/${grandChild.slug}`,
        }));
      }

      return childItem;
    });
  }

  return menuItem;
};

const Header = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector(state => state.auth);
  const cartItems = useAppSelector(state => state.cart.items);
  const cartCount = useAppSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  useEffect(() => {
    if (accessToken && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, user, dispatch]);
  useEffect(() => {
    dispatch(fetchCart(user?.data.userId));
  }, [user]);

  // Lấy categories từ Redux store
  const categories = useAppSelector(
    (state: RootState) => state.homePage.homeData?.categories || []
  );

  // Chuyển đổi categories từ API thành menuItems
  // Cấu trúc API: Level 1 (Áo, Quần) -> Level 2 (Áo thun, Áo polo...) -> Level 3 (Áo ba lỗ, Polo tay dài...)
  // API đã trả về đúng cấu trúc phân cấp, chỉ cần map trực tiếp
  const menuItems = useMemo(() => {
    // Tách categories thành 2 nhóm
    const parentCats = categories.filter(
      cat => !cat.children || cat.children.length === 0
    );
    const childCats = categories.filter(
      cat => cat.children && cat.children.length > 0
    );

    return parentCats.map(parent => {
      const menuItem: MenuItem = {
        name: parent.name,
        path: `/category/${parent.slug}`,
      };

      // Tìm các category cấp 2 thuộc về parent này
      // VD: "Áo thun", "Áo polo" thuộc "Áo"
      const relatedChildren = childCats.filter(cat =>
        cat.name.toLowerCase().includes(parent.name.toLowerCase())
      );

      if (relatedChildren.length > 0) {
        menuItem.dropdown = relatedChildren.map(convertCategoryToMenuItem);
      }

      return menuItem;
    });
  }, [categories]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const MegaMenuDropdown = ({ item }: { item: MenuItem }) => {
    const hasNestedDropdown = item.dropdown?.some(sub => sub.dropdown);

    return (
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
        style={{ minWidth: hasNestedDropdown ? "600px" : "240px" }}
      >
        <div
          className={`p-4 ${hasNestedDropdown ? "grid grid-cols-2 gap-6" : ""}`}
        >
          {item.dropdown?.map((subItem, index) => (
            <div key={subItem.path} className="space-y-2">
              {subItem.dropdown && subItem.dropdown.length > 0 ? (
                <div className="font-semibold text-gray-900 text-sm py-1 cursor-default">
                  {subItem.name}
                </div>
              ) : (
                <Link
                  to={subItem.path}
                  className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm py-1"
                >
                  {subItem.name}
                </Link>
              )}
              {subItem.dropdown && subItem.dropdown.length > 0 && (
                <div className="pl-3 space-y-1 border-l-2 border-gray-200">
                  {subItem.dropdown.map(nestedItem => (
                    <Link
                      key={nestedItem.path}
                      to={nestedItem.path}
                      className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                    >
                      {nestedItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map(item =>
              item.dropdown ? (
                <div key={item.name} className="relative group">
                  <button className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors flex items-center gap-1">
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <MegaMenuDropdown item={item} />
                </div>
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
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5 text-gray-700" />
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
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
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center space-x-2 pb-4 border-b w-full text-left"
                  >
                    <Search className="h-5 w-5 text-gray-500" />
                    <span className="flex-1 text-sm text-gray-500">
                      Tìm kiếm...
                    </span>
                  </button>

                  {/* Mobile Menu Items */}
                  {menuItems.map(item => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Link
                          to={item.path}
                          className="block text-base font-medium text-gray-900 hover:text-gray-600 flex-1"
                          onClick={() =>
                            !item.dropdown && setIsMobileMenuOpen(false)
                          }
                        >
                          {item.name}
                        </Link>
                        {item.dropdown && (
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === item.name ? null : item.name
                              )
                            }
                            className="p-2"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                openDropdown === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Level 1 Dropdown */}
                      {item.dropdown && openDropdown === item.name && (
                        <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                          {item.dropdown.map(subItem => (
                            <div key={subItem.path} className="space-y-1">
                              <div className="flex items-center justify-between">
                                {subItem.dropdown &&
                                subItem.dropdown.length > 0 ? (
                                  <div className="block text-sm font-medium text-gray-700 flex-1 cursor-default">
                                    {subItem.name}
                                  </div>
                                ) : (
                                  <Link
                                    to={subItem.path}
                                    className="block text-sm font-medium text-gray-700 hover:text-gray-900 flex-1"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                                {subItem.dropdown && (
                                  <ChevronRight className="h-3 w-3 text-gray-400" />
                                )}
                              </div>

                              {/* Level 2 Dropdown */}
                              {subItem.dropdown && (
                                <div className="pl-3 space-y-1">
                                  {subItem.dropdown.map(nestedItem => (
                                    <Link
                                      key={nestedItem.path}
                                      to={nestedItem.path}
                                      className="block text-xs text-gray-600 hover:text-gray-900 py-1"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      • {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
