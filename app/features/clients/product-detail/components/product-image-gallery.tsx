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
    <div className="flex flex-col sm:flex-row justify-around items-start gap-3 sm:gap-4">
      {/* List images - Mobile: horizontal scroll, Desktop: vertical */}
      <div className="flex sm:flex-col gap-2 pb-2 w-full sm:w-auto sm:max-h-[500px] sm:min-w-[58px] md:min-w-[70px] lg:min-w-[80px] overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto scrollbar-custom order-2 sm:order-1">
        {images.map((image, index) => (
          <div
            className="flex-shrink-0 w-16 h-16 sm:w-full sm:h-16 md:h-20 lg:h-24 cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-gray-400 transition-colors"
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
        className="w-full sm:flex-1 max-h-[400px] sm:max-h-[500px] md:max-h-[580px] lg:max-h-[650px] relative overflow-y-auto rounded-lg shadow-md scrollbar-custom order-1 sm:order-2"
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
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
