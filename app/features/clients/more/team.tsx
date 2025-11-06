import { Users, Award, Heart, Zap } from "lucide-react";
import { Link } from "react-router";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Lữ Quang Minh",
      role: "Tổng Giám Đốc Điều Hành (CEO)",
      image: "/luquangminh.jpg",
      description: "Giám sát toàn bộ hoạt động và định hướng phát triển MEYA",
    },
    {
      name: "Nguyễn Thanh Điền",
      role: "Giám Đốc Vận Hành (COO)",
      image: "/nguyenthanhdien.jpg",
      description: "Quản lý hoạt động bán hàng, quy trình và quản trị cửa hàng",
    },
    {
      name: "Nguyễn Thế Ngọc",
      role: "Giám Đốc Công Nghệ (CTO)",
      image: "/nguyenthengoc.jpg",
      description: "Phụ trách nền tảng công nghệ, website và hệ thống bảo mật",
    },
    {
      name: "Đặng Huy Hoàng",
      role: "Giám Đốc Marketing (CMO)",
      image: "/danghuyhoang-19.jpg",
      description: "Xây dựng thương hiệu, quảng cáo và truyền thông sản phẩm",
    },
    {
      name: "Đặng Huy Hoàng",
      role: "Giám Đốc Kho Vận (Logistics Director)",
      image: "/danghuyhoang-20.jpg",
      description: "Quản lý kho, vận chuyển và điều phối đơn hàng",
    },
    {
      name: "Trần Minh Trí",
      role: "Giám Đốc Chăm Sóc Khách Hàng (Customer Service Director)",
      image: "/logo-icon.png",
      description: "Chăm sóc khách hàng, hỗ trợ và xử lý khiếu nại",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Đội Ngũ Của Chúng Tôi
            </h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Những con người tài năng và nhiệt huyết đằng sau thành công của
              MEYA
            </p>
          </div>
        </div>
      </div>

      {/* Team Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Giá Trị Đội Ngũ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những giá trị cốt lõi mà mọi thành viên trong đội ngũ MEYA đều tuân
            thủ
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Xuất Sắc</h3>
            <p className="text-sm text-gray-600">
              Luôn phấn đấu để đạt được kết quả tốt nhất
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Hợp Tác</h3>
            <p className="text-sm text-gray-600">
              Làm việc nhóm và hỗ trợ lẫn nhau
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Đam Mê</h3>
            <p className="text-sm text-gray-600">
              Yêu thương công việc và sản phẩm
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="font-semibold mb-2">Sáng Tạo</h3>
            <p className="text-sm text-gray-600">
              Không ngừng đổi mới và cải tiến
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Thành Viên Chủ Chốt</h2>
            <p className="text-gray-600">
              Gặp gỡ những người dẫn dắt MEYA đến thành công
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-100 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
