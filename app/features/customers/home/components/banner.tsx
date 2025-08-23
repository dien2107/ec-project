import React from "react";

export default function Banner() {
  const bgUrl =
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1600&auto=format&fit=crop";

  return (
    <section
      className="relative w-full h-[400px] flex items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* content */}
      <div className="relative z-10 text-left text-white max-w-xl px-10">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Bộ Sưu Tập Mới 2025
        </h1>
        <p className="text-lg mb-6 drop-shadow-md">
          Khám phá các thiết kế mới nhất từ YAME. Phong cách trẻ trung, độc đáo
          dành cho giới trẻ Việt Nam.
        </p>
        <button className="px-6 py-2 bg-white text-black rounded font-semibold hover:bg-gray-100 transition">
          Khám phá ngay
        </button>
      </div>
    </section>
  );
}
