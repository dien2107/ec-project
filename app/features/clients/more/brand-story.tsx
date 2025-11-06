import { Heart, Target, Users, Lightbulb } from "lucide-react";
import { Link } from "react-router";

export default function BrandStoryPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Câu Chuyện Thương Hiệu
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Hành trình xây dựng và phát triển thương hiệu MEYA
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Origin Story */}
          <section className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-yellow-600" />
              <h2 className="text-3xl font-bold">Khởi Nguồn</h2>
            </div>
            <p className="text-gray-600 mb-4">
              MEYA được thành lập vào tháng 4 năm 2025 với mong muốn mang đến những sản
              phẩm chất lượng cao và phong cách thời trang hiện đại cho người
              Việt Nam.
            </p>
            <p className="text-gray-600 mb-4">
              Từ một cửa hàng nhỏ với đội ngũ chỉ 6 người, chúng tôi đã không
              ngừng nỗ lực và phát triển. Với niềm đam mê và sự tận tâm, MEYA đã
              nhanh chóng trở thành một trong những thương hiệu được yêu thích
              nhất tại Việt Nam.
            </p>
            <p className="text-gray-600">
              Tên "MEYA" được lấy cảm hứng từ chữ "MY" (của tôi) và "A" (đầu
              tiên), thể hiện cam kết của chúng tôi trong việc đặt khách hàng
              lên hàng đầu và mang đến trải nghiệm cá nhân hóa cho từng người.
            </p>
          </section>

          {/* Mission */}
          <section className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Sứ Mệnh</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Sứ mệnh của MEYA là democratize fashion - làm cho thời trang chất
              lượng cao trở nên dễ tiếp cận hơn cho mọi người. Chúng tôi tin
              rằng ai cũng xứng đáng có những sản phẩm đẹp và chất lượng mà
              không cần phải chi tiêu quá nhiều.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Chất Lượng</h3>
                <p className="text-sm text-gray-600">
                  Kiểm soát chất lượng nghiêm ngặt từ khâu chọn nguyên liệu đến
                  thành phẩm
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Giá Cả Hợp Lý</h3>
                <p className="text-sm text-gray-600">
                  Tối ưu chi phí để mang đến giá tốt nhất cho khách hàng
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Phong Cách</h3>
                <p className="text-sm text-gray-600">
                  Cập nhật xu hướng thời trang mới nhất từ khắp thế giới
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Dịch Vụ</h3>
                <p className="text-sm text-gray-600">
                  Phục vụ tận tâm với mục tiêu mang lại trải nghiệm tuyệt vời
                </p>
              </div>
            </div>
          </section>
          {/* Future Vision */}
          <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Tầm Nhìn Tương Lai</h2>
            </div>
            <p className="text-indigo-100 mb-4">
              Đến năm 2030, MEYA phấn đấu trở thành thương hiệu thời trang hàng
              đầu Đông Nam Á, được biết đến không chỉ với sản phẩm chất lượng mà
              còn với cam kết về trách nhiệm xã hội và môi trường.
            </p>
            <p className="text-indigo-100">
              Chúng tôi sẽ tiếp tục đổi mới, sáng tạo và lắng nghe khách hàng để
              mang đến những trải nghiệm mua sắm tuyệt vời nhất. Cảm ơn bạn đã
              đồng hành cùng MEYA!
            </p>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/about"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Tìm Hiểu Thêm Về Chúng Tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
