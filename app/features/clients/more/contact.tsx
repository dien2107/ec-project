import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info - Centered Layout */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Thông Tin Liên Hệ
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Địa Chỉ</h3>
                <p className="text-gray-600">
                  Phòng C.D401, Trường Đại học Sài Gòn
                  <br />
                  273 An Dương Vương, Phường Chợ Quán
                  <br />
                  Thành phố Hồ Chí Minh 700000, Việt Nam
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Điện Thoại</h3>
                <p className="text-gray-600">
                  Hotline: 08988 400 xx
                  <br />
                  Di động: 0xxx xxx xxx
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Email</h3>
                <p className="text-gray-600">
                  support@meya.vn
                  <br />
                  info@meya.vn
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Giờ Làm Việc</h3>
                <p className="text-gray-600">
                  Thứ 3: 7:00 - 11:40
                  <br />
                  Các ngày khác: Liên hệ trước
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 text-center border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Cần Hỗ Trợ Thêm?
            </h3>
            <p className="text-gray-600 mb-4">
              Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
              <br />
              Vui lòng liên hệ qua số điện thoại để được tư vấn nhanh
              chóng.
            </p>
            {/* <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="font-semibold text-blue-600">
                  📞 Hotline 24/7
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="font-semibold text-green-600">
                  💬 Tư vấn miễn phí
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="font-semibold text-purple-600">
                  🚀 Phản hồi nhanh
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
