import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, X } from "lucide-react";
import {
  uploadSingleProductImage,
  deleteSingleProductImage,
} from "~/services/product-images";
import type { Product, ProductImage } from "../types";
import toast from "react-hot-toast";

export default function DropzoneProductImage({
  selectedProduct,
  productImages,
  reloadImages,
}: {
  selectedProduct: Product | null;
  productImages: ProductImage[] | [];
  reloadImages: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [primaryImage, setPrimaryImage] = useState<ProductImage | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0] || null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  });

  useEffect(() => {
    const primaryImage =
      productImages.find((pi) => pi.isPrimary === true) || null;

    setPrimaryImage(primaryImage);
  }, [productImages]);

  // Handle change file to server
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isPrimary: boolean
  ) => {
    setIsLoading(true);
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!selectedProduct || !selectedProduct.productId) {
        toast.error("Không tìm thấy id của sản phẩm!");
        return;
      }

      const formData = new FormData();
      formData.append("FileImage", file as Blob);
      formData.append("IsPrimary", isPrimary ? "true" : "false");

      const response = await uploadSingleProductImage(
        selectedProduct.productId,
        formData
      );
      if (response.isSuccess) {
        toast.success("Tải ảnh lên thành công!");
        reloadImages();
        // Reset input file
        setFileInputKey((k) => k + 1);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (productImageId: number) => {
    setIsLoading(true);
    try {
      if (!selectedProduct || !selectedProduct.productId) {
        toast.error("Không tìm thấy id của sản phẩm!");
        return;
      }
      const response = await deleteSingleProductImage(
        selectedProduct.productId,
        productImageId
      );
      if (response.isSuccess) {
        toast.success("Xóa ảnh thành công!");
        reloadImages();
        // Reset input file
        setFileInputKey((k) => k + 1);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-start gap-4 min-w-0">
        {/* Loading overlay chỉ phủ phần này */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {/* Start: Primary Image */}
        {primaryImage ? (
          <div className="flex-1 w-full">
            <label className="text-sm font-medium mb-2 block">
              Ảnh sản phẩm
            </label>
            <div
              key={primaryImage.productImageId}
              className="relative flex items-center justify-center"
            >
              <img
                src={primaryImage.imageUrl}
                alt={primaryImage.altText}
                className="w-50 h-50 object-cover rounded"
              />
              <input
                id="primaryImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadFile(e, true)}
                className="absolute inset-0 opacity-0 cursor-pointer hidden"
              />
              <label
                htmlFor="primaryImage"
                className="absolute cursor-pointer left-1/2 -translate-x-1/2 bottom-2 bg-white rounded-sm py-1 px-2 shadow hover:bg-blue-500 hover:text-white transition-colors"
              >
                <span>Thay đổi</span>
              </label>
            </div>
          </div>
        ) : (
          <section className="flex-1 w-full">
            <label className="text-sm font-medium mb-2 block">
              Ảnh sản phẩm
            </label>
            <div
              {...getRootProps()}
              className={`border-dashed min-h-40 border-2 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                      ${
                        selectedFile
                          ? "border-gray-500 bg-blue-50"
                          : "border-gray-300 bg-transparent hover:border-blue-400"
                      }
                    `}
            >
              <input {...getInputProps()} />
              <p className="text-gray-500 mb-2">
                Kéo thả hoặc bấm vào đây để chọn ảnh
              </p>
              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt={selectedFile.name}
                  className="w-32 h-32 object-cover rounded shadow mt-2"
                />
              )}
            </div>
          </section>
        )}
        {/* End: Primary Image */}

        {/* Start: Secondary Images */}
        <div className="min-w-0 w-full">
          <div className="text-sm font-medium mb-2 inline-block">Ảnh phụ</div>
          <div className="w-full min-w-0 ">
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-custom min-w-0">
              {productImages
                .filter((pi) => !pi.isPrimary)
                .map((pi) => (
                  <div
                    key={pi.productImageId}
                    className="relative w-40 h-40 flex-shrink-0"
                  >
                    <img
                      src={pi.imageUrl}
                      alt={pi.altText}
                      className="w-40 h-40 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(pi.productImageId)}
                      className="absolute cursor-pointer top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-colors"
                      title="Xóa ảnh"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              <div className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer relative flex-shrink-0">
                <input
                  key={fileInputKey}
                  id="childImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadFile(e, false)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <label
                  htmlFor="childImage"
                  className="flex flex-col items-center justify-center text-gray-500"
                >
                  <Plus className="w-8 h-8 mb-1" />
                  <span>Thêm ảnh</span>
                </label>
              </div>
              {/* End: Secondary Images */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
