import {
  Search,
  User,
  ShoppingBag,
  Menu as MenuIcon,
  ChevronDown,
  ChevronRight,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import { logoutLocal } from "~/redux/slices/auth";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector, type RootState } from "~/redux/store";
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

const convertCategoryToMenuItem = (category: Category): MenuItem | null => {
  const filteredChildren = category.children
    ?.map((child) => {
      const validGrand = child.children?.filter((gc) => gc.hasProduct);
      if (child.hasProduct || (validGrand && validGrand.length > 0)) {
        return { ...child, children: validGrand || [] };
      }
      return null;
    })
    .filter(Boolean) as Category[];

  if (
    !category.hasProduct &&
    (!filteredChildren || filteredChildren.length === 0)
  ) {
    return null;
  }

  const item: MenuItem = {
    name: category.name,
    path: `/categories/${category.slug}`,
  };

  if (filteredChildren && filteredChildren.length > 0) {
    item.dropdown = filteredChildren.map((child) => ({
      name: child.name,
      path: `/categories/${child.slug}`,
      dropdown: child.children?.map((gc) => ({
        name: gc.name,
        path: `/categories/${gc.slug}`,
      })),
    }));
  }

  return item;
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector(
    (state: RootState) => state.cart.items.length
  );

  useEffect(() => {
    if (accessToken && !user) dispatch(fetchCurrentUser());
  }, [accessToken, user]);

  useEffect(() => {
    dispatch(fetchCart(user?.data.userId));
  }, [user]);

  const isAuthenticated = !!user;

  const categories = useAppSelector(
    (state: RootState) => state.homePage.homeData?.categories || []
  );

  const staticMenuItems: MenuItem[] = [
    { name: "Trang chủ", path: "/" },
    {
      name: "Giới thiệu",
      path: "/about",
      dropdown: [
        { name: "Về chúng tôi", path: "/about" },
        { name: "Câu chuyện thương hiệu", path: "/brand-story" },
        { name: "Đội ngũ", path: "/team" },
      ],
    },
  ];

  const menuItems = useMemo(() => {
    const dynamicItems = categories
      .map(convertCategoryToMenuItem)
      .filter((i): i is MenuItem => i !== null);

    return [
      ...staticMenuItems,
      ...dynamicItems,
      { name: "Liên hệ", path: "/contact" },
    ];
  }, [categories]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logoutLocal());
    setIsProfileDropdownOpen(false);
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  useEffect(
    () =>
      window.addEventListener("scroll", () =>
        setIsScrolled(window.scrollY > 10)
      ),
    []
  );

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isProfileDropdownOpen]);

  const MegaMenuDropdown = ({ item }: { item: MenuItem }) => {
    const hasNested = item.dropdown?.some((s) => s.dropdown);
    return (
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
        style={{ minWidth: hasNested ? "600px" : "240px" }}
      >
        <div className={`p-4 ${hasNested ? "grid grid-cols-2 gap-6" : ""}`}>
          {item.dropdown?.map((sub) => (
            <div key={sub.path} className="space-y-2">
              {sub.dropdown ? (
                <div className="font-semibold text-gray-900 text-sm">
                  {sub.name}
                </div>
              ) : (
                <Link
                  to={sub.path}
                  className="block font-semibold text-gray-900 hover:text-blue-600 text-sm"
                >
                  {sub.name}
                </Link>
              )}
              {sub.dropdown && (
                <div className="pl-3 space-y-1 border-l-2 border-gray-200">
                  {sub.dropdown.map((n) => (
                    <Link
                      key={n.path}
                      to={n.path}
                      className="block text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
                    >
                      {n.name}
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
      className={`bg-white w-full h-16 sticky top-0 z-50 transition-all ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ✅ LOGO */}
        <Link to="/" className="flex items-center">
          <img className="h-10 w-auto" src="/logo.png" alt="logo" />
        </Link>

        {/* ✅ DESKTOP MENU */}
        <nav className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) =>
            item.dropdown ? (
              <div key={item.name} className="relative group">
                <button className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded flex items-center gap-1">
                  {item.name}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <MegaMenuDropdown item={item} />
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        {/* ✅ RIGHT SIDE ICONS */}
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-gray-700" />
          </Button>

          {/* ================= AUTHENTICATED ================= */}
          {isAuthenticated ? (
            <>
              {/* Profile icon only on desktop */}
              <div
                className="relative hidden sm:block"
                ref={profileDropdownRef}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProfileDropdownOpen((v) => !v)}
                >
                  <User className="h-5 w-5 text-gray-700" />
                </Button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white w-56 rounded-lg shadow-xl border py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <UserCircle className="h-4 w-4" /> Thông tin cá nhân
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>

              {/* Cart icon */}
              <Link to="/cart" className="hidden sm:flex relative">
                <ShoppingBag className="h-5 w-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              {/* ================= GUEST ================= */}
              {/* ✅ Hiển thị từ 640px↑ */}
              <Link to="/login">
                <Button className="hidden sm:flex text-sm" variant="ghost">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-sm text-white">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}

          {/* ✅ MOBILE MENU BUTTON */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 bg-gray-50"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* ✅ MOBILE MENU CONTENT */}
            <SheetContent side="right" className="w-full overflow-y-auto pb-24">
              <div className="mt-7 px-5 flex flex-col gap-5">
                {/* Search */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-3 border-b pb-3"
                >
                  <Search className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-500 text-sm">Tìm kiếm...</span>
                </button>

                {/* Nếu chưa đăng nhập → hiển thị tại MENU */}
                {!isAuthenticated && (
                  // chỉ hiển thị login/register trong mobile menu < 640px
                  <div className="flex flex-col gap-3 border-b pb-3 sm:hidden">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="h-11 flex justify-center items-center rounded-md bg-blue-600 text-white text-sm"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="h-11 flex justify-center items-center rounded-md bg-gray-100 text-gray-900 text-sm"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}

                {/* Authenticated user info */}
                {isAuthenticated && (
                  <>
                    <div className="border-b pb-3 flex items-center gap-3">
                      <img
                        src={
                          user?.data?.imageUrl === null
                            ? "/logo-icon.png"
                            : user?.data?.imageUrl
                        }
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {user?.data?.fullName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user?.data?.email}
                        </div>
                      </div>

                      {/* Xem hồ sơ on the same row */}
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="ml-auto inline-flex items-center justify-center h-10 px-3 rounded-md text-sm bg-gray-100 text-gray-900 hover:bg-gray-200"
                      >
                        Xem hồ sơ
                      </Link>
                    </div>

                    <Link
                      to="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-2 hover:bg-gray-50"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Giỏ hàng
                      {cartCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex justify-center items-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* MENU ITEMS */}
                {menuItems.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Link
                        to="#"
                        className="text-base font-medium text-gray-900"
                        // onClick={() =>
                        //   !item.dropdown && setIsMobileMenuOpen(false)
                        // }
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
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition ${openDropdown === item.name ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {item.dropdown && openDropdown === item.name && (
                      <div className="pl-4 space-y-1 border-l">
                        {item.dropdown.map((sub) => (
                          <div key={sub.path}>
                            <Link
                              to="#"
                              className="block text-sm text-gray-700 py-1"
                              // onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>

                            {sub.dropdown && (
                              <div className="pl-3 space-y-1 border-l">
                                {sub.dropdown.map((n) => (
                                  <Link
                                    key={n.path}
                                    to={n.path}
                                    className="text-xs text-gray-600 py-1 block"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    • {n.name}
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

                {/* Logout footer */}
                {isAuthenticated && (
                  <div className="sticky bottom-0 bg-white border-t pt-3">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-11 bg-red-600 text-white rounded-md"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search modal */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
