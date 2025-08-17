import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function TabsInfo() {
  return (
    <div>
      <Tabs defaultValue="product" className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="product"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-3 h-10 text-gray-500 transition-colors duration-200"
          >
            Mô tả sản phẩm
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-3 h-10 text-gray-500 transition-colors duration-200"
          >
            Vận chuyển & Đổi trả
          </TabsTrigger>
        </TabsList>
        <span className="border-b border-gray-200"></span>
        <TabsContent value="product">
          <div className="pt-4 mb-4">
            <h1 className="font-medium mb-2">Thông tin sản phẩm</h1>
            <ul className="list-disc ml-5">
              <li className="mb-1 text-md">
                Tên sản phẩm: <span className="text-gray-700">Áo thun nam</span>
              </li>
              <li className="mb-1 text-md">
                Chất liệu: <span className="text-gray-700">100% cotton</span>
              </li>
              <li className="mb-1 text-md">
                Màu sắc: <span className="text-gray-700">Đen, Trắng, Xanh</span>
              </li>
              <li className="mb-1 text-md">
                Kích thước: <span className="text-gray-700">S, M, L, XL</span>
              </li>
              <li className="mb-1 text-md">
                Xuất xứ: <span className="text-gray-700">Việt Nam</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <div className="pt-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Chính sách vận chuyển</h3>
              <p className="text-gray-700">
                Giao hàng miễn phí cho đơn hàng từ 300.000₫. Thời gian giao hàng
                từ 2-5 ngày tùy khu vực.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Chính sách đổi trả</h3>
              <p className="text-gray-700">
                YAME hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận
                hàng nếu sản phẩm còn nguyên tem mác, chưa qua sử dụng.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
