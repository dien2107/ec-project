import { Menu as MenuIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const Menu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="text-center">
            Điều hướng của Yame
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          <nav className="grid gap-2">
            {[
              { label: "Áo", href: "/ao" },
              { label: "Quần", href: "/quan" },
              { label: "Phụ kiện", href: "/phu-kien" },
              { label: "Khuyến mãi - Giảm giá", href: "/khuyen-mai-giam-gia" },
              { label: "Đồ thể thao", href: "/do-the-thao" },
            ].map(({ label, href }) => (
              <Button
                key={href}
                variant="ghost"
                className="justify-start"
                asChild
              >
                <Link to={href}>{label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
