import { useRef } from "react";

import type { ProductImage } from "~/types/product/product-image";

export default function ProductImageGallery({
  images,
}: {
  images: ProductImage[];
}) {
  const mainImageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const scrollToImage = (id: number) => {
    const container = mainImageContainerRef.current;
    const target = imageRefs.current[id];

    if (container && target) {
      container.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="flex justify-between items-start gap-4">
      {/* List images */}
      <div className="flex flex-col gap-y-2 pb-2 max-h-[500px] min-w-[58px] overflow-y-auto scrollbar-custom">
        {images.map((image, index) => (
          <div
            className="w-full h-20 cursor-pointer"
            key={image.productImageId}
            onClick={() => scrollToImage(image.productImageId)}
          >
            <img
              src={image.imageUrl}
              alt={image.altText}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Main image */}
      <div
        ref={mainImageContainerRef}
        className="max-h-[650px] relative overflow-y-auto rounded-lg shadow-md scrollbar-custom"
      >
        {images.map((image, index) => {
          return (
            <div
              ref={(el) => {
                imageRefs.current[image.productImageId] = el;
              }}
              className="h-full overflow-hidden"
              key={image.productImageId}
            >
              <img
                src={image.imageUrl}
                alt={image.altText}
                className="h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
