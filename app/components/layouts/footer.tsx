import { Separator } from "~/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

const quickLinks = ["Trang chủ", "Áo", "Quần", "Phụ kiện", "Khuyến mãi"];
const policies = [
  "Chính sách thanh toán",
  "Chính sách vận chuyển",
  "Chính sách bảo hành",
  "Chính sách đổi trả",
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full min-h-[62vh] py-12 px-4 text-white flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600"></div>
      <div className="absolute top-20 -right-20 w-72 h-72 bg-zinc-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -left-20 w-72 h-72 bg-zinc-600/20 rounded-full blur-3xl"></div>

      <div className="main-container space-y-8 flex-1 flex flex-col relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              MEYA
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Thương hiệu thời trang hàng đầu dành cho giới trẻ Việt Nam với
              phong cách trẻ trung, năng động và luôn cập nhật xu hướng mới
              nhất.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-zinc-700/50 hover:bg-zinc-600/50 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-zinc-500/20"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Liên kết nhanh
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-zinc-500 to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-zinc-400 hover:text-zinc-200 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    → {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Policies */}
          <nav>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Chính sách
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-zinc-500 to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {policies.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-zinc-400 hover:text-zinc-200 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    → {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Liên hệ
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-zinc-500 to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center group-hover:bg-zinc-600/50 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center group-hover:bg-zinc-600/50 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>contact@meya.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center group-hover:bg-zinc-600/50 transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Số 123 Nguyễn Trãi, Quận 1, TP HCM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1"></div>

        <Separator className="bg-zinc-700/50" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>© 2025 MEYA. Tất cả các quyền được bảo lưu</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Điều khoản sử dụng
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Chính sách bảo mật
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
