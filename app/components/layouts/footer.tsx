import { Separator } from "~/components/ui/separator";

const quickLinks = ["Trang chủ", "Áo", "Quần", "Phụ kiện", "Khuyến mãi"];
const policies = [
  "Chính sách thanh toán",
  "Chính sách vận chuyển",
  "Chính sách bảo hành",
  "Chính sách đổi trả",
];

const Footer = () => {
  return (
    <footer className="bg-[#363c41] w-full py-8 px-4 text-white">
      <div className="main-container space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div>
            <h3 className="text-lg font-semibold mb-4">YAME</h3>
            <p className="mt-2 text-sm">
              Thương hiệu thời trang hàng đầu dành cho giới trẻ Việt Nam với
              phong cách trẻ trung, năng động và luôn cập nhật xu hướng mới
              nhất.
            </p>
          </div>

          <nav>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:underline transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <h3 className="text-lg font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2">
              {policies.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:underline transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li>📞 0123 456 789</li>
              <li>📧 contact@yame.com</li>
              <li>📍 Số 123 Nguyễn Trãi, Quận 1, TP HCM</li>
            </ul>
          </div>
        </div>

        <Separator className="my-4 bg-white/20" />

        <div className="text-center text-sm opacity-80">
          © 2025 YAME. Tất cả các quyền được bảo lưu
        </div>
      </div>
    </footer>
  );
};

export default Footer;
