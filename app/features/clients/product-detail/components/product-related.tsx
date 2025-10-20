import ProductCard from "~/components/ui/product-card";

export default function ProductRelated() {
  return (
    <div className="py-8">
      <h2 className="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-5 gap-x-4 gap-y-12">
        <ProductCard
          id={1}
          title="Áo Thun Cổ Tròn Tay Ngắn ONE PIECE 07"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-one-piece-07-0022439/45360eef-9a10-0500-637c-001ad59569a9.jpg?w=540&h=756&c=true&v=052025"
          price={128500}
          oldPrice={257000}
          discount={50}
        />
        <ProductCard
          id={2}
          title="Áo Thun Dáng Rộng No Style M50"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-2-chieu-tham-hut-bieu-tuong-dang-rong-gia-tot-no-style-m50-0023412/8b3f88c1-9ef3-2701-eec9-001b590c04dd.jpg?w=540&h=756&c=true&v=052025"
          price={159000}
          oldPrice={318000}
          discount={50}
        />
        <ProductCard
          id={3}
          title="Áo Thun Cổ Tròn Tay Ngắn Vải Cotton 4 Chiều"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-cotton-4-chieu-tham-hut-bieu-tuong-dang-rong-gia-tot-no-style-m48-0023408/098fe49b-3434-f900-f0e8-001b590b5207.jpg?w=540&h=756&c=true&v=052025"
          price={139000}
          oldPrice={278000}
          discount={50}
        />
        <ProductCard
          id={4}
          title="Áo Thun Cổ Tròn Tay Ngắn ONE PIECE M7 Kem"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-cotton-2-chieu-mac-mat-phoi-mau-dang-vua-danh-cho-fan-one-piece-m7-0023693/4e0f66f5-11bc-1d00-ac18-001b958335e1.jpg?w=540&h=756&c=true&v=052025"
          price={163500}
          oldPrice={327000}
          discount={50}
        />
        <ProductCard
          id={1}
          title="Áo Thun Cổ Tròn Tay Ngắn ONE PIECE 07"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-one-piece-07-0022439/45360eef-9a10-0500-637c-001ad59569a9.jpg?w=540&h=756&c=true&v=052025"
          price={128500}
          oldPrice={257000}
          discount={50}
        />
        <ProductCard
          id={2}
          title="Áo Thun Dáng Rộng No Style M50"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-2-chieu-tham-hut-bieu-tuong-dang-rong-gia-tot-no-style-m50-0023412/8b3f88c1-9ef3-2701-eec9-001b590c04dd.jpg?w=540&h=756&c=true&v=052025"
          price={159000}
          oldPrice={318000}
          discount={50}
        />
        <ProductCard
          id={3}
          title="Áo Thun Cổ Tròn Tay Ngắn Vải Cotton 4 Chiều"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-cotton-4-chieu-tham-hut-bieu-tuong-dang-rong-gia-tot-no-style-m48-0023408/098fe49b-3434-f900-f0e8-001b590b5207.jpg?w=540&h=756&c=true&v=052025"
          price={139000}
          oldPrice={278000}
          discount={50}
        />
        <ProductCard
          id={4}
          title="Áo Thun Cổ Tròn Tay Ngắn ONE PIECE M7 Kem"
          image="https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-cotton-2-chieu-mac-mat-phoi-mau-dang-vua-danh-cho-fan-one-piece-m7-0023693/4e0f66f5-11bc-1d00-ac18-001b958335e1.jpg?w=540&h=756&c=true&v=052025"
          price={163500}
          oldPrice={327000}
          discount={50}
        />
      </div>
    </div>
  );
}
