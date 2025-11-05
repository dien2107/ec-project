import { Link } from "react-router";
import { CheckCircle, Users, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Về Chúng Tôi
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với dịch
              vụ tốt nhất
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <p className="text-gray-600 mb-4">
              Được thành lập với tầm nhìn mang đến những sản phẩm chất lượng cao
              và dịch vụ khách hàng xuất sắc, chúng tôi đã không ngừng phát
              triển và hoàn thiện.
            </p>
            <p className="text-gray-600 mb-4">
              Với đội ngũ nhân viên tận tâm và quy trình kiểm soát chất lượng
              nghiêm ngặt, chúng tôi tự hào là đối tác đáng tin cậy của hàng
              ngàn khách hàng trên toàn quốc.
            </p>
            <p className="text-gray-600">
              Sứ mệnh của chúng tôi là không chỉ cung cấp sản phẩm mà còn mang
              đến trải nghiệm mua sắm tuyệt vời nhất cho mỗi khách hàng.
            </p>
          </div>
          <div className="relative">
            <img
              src="/logo.png"
              alt="About Us"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những giá trị mà chúng tôi luôn theo đuổi và giữ vững trong suốt
              quá trình phát triển
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chất Lượng</h3>
              <p className="text-gray-600 text-sm">
                Cam kết cung cấp sản phẩm chất lượng cao nhất
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Khách Hàng</h3>
              <p className="text-gray-600 text-sm">
                Đặt khách hàng làm trung tâm trong mọi quyết định
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tận Tâm</h3>
              <p className="text-gray-600 text-sm">
                Phục vụ với sự nhiệt tình và trách nhiệm cao nhất
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Uy Tín</h3>
              <p className="text-gray-600 text-sm">
                Xây dựng niềm tin qua từng sản phẩm và dịch vụ
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Bắt Đầu?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi và trải nghiệm
            dịch vụ tuyệt vời
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Bắt đầu ngay
            </Link>
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-600"
            >
              Liên Hệ Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
