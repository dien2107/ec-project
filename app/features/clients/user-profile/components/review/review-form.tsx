import { useQuery } from "@tanstack/react-query";
import { Camera, Image, Send, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import type { OrderItem } from "~/features/clients/user-profile/types/user";
import { useAppSelector, useAppDispatch, type RootState } from "~/redux/store";
import { createReview, getReviewById, updateReview } from "~/services/reviews";
import MediaPreview from "./media-preview";
import StarRating from "./star-rating";
import { fetchOrderListDataByUserId } from "~/redux/slices/orders";

export default function ReviewForm({
  item,
  mode,
  onSuccess,
  onClose,
}: {
  item: OrderItem["items"][0];
  mode: "view" | "edit" | "create";
  onSuccess?: () => void;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<
    { reviewImageId: number; imageUrl: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isView = mode === "view";
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Load existing review when view/edit mode
  const reviewId = (item as any)?.review?.reviewId;
  const { data: reviewData, isLoading: isReviewLoading } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => getReviewById(reviewId),
    enabled: mode !== "create" && !!reviewId,
  });

  useEffect(() => {
    if (reviewData?.data && mode !== "create") {
      const review = reviewData.data;

      setRating(review.rating);
      setReviewText(review.comment || "");

      if (Array.isArray(review.reviewImages)) {
        const imgs = review.reviewImages.map((img: any) => ({
          reviewImageId: img.reviewImageId,
          imageUrl: img.imageUrl,
        }));

        setOldImages(imgs);
      }
    }
  }, [mode, reviewData]);

  const handleMediaUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length + mediaFiles.length > 5) {
        alert("Tối đa 5 ảnh/video");
        return;
      }

      setMediaFiles(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          setMediaPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    },
    [mediaFiles.length]
  );

  const removeMedia = useCallback((index: number) => {
    if (isView) return;
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("rating", rating.toString());
      if (reviewText.trim()) {
        formData.append("comment", reviewText.trim());
      }
      if (mediaFiles.length > 0) {
        mediaFiles.forEach(file => {
          formData.append("images", file);
        });
      }

      if (mode === "edit") {
        oldImages.forEach(img => {
          formData.append("keepImageIds", img.reviewImageId.toString());
        });
        await updateReview(reviewId, formData);
        toast.success("Cập nhật đánh giá thành công!");
      } else {
        await createReview(item.orderItemId, formData);
        toast.success("Đánh giá sản phẩm thành công!");
      }

      // Gọi callback để reload data trước khi đóng
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm địa chỉ!");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    rating,
    reviewText,
    oldImages,
    mediaFiles,
    item.orderItemId,
    mode,
    reviewId,
    onClose,
  ]);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto scrollbar-custom">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative p-6 border-b bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Đánh giá sản phẩm
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Chia sẻ trải nghiệm của bạn
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto scrollbar-custom flex-1">
            {/* Product Info */}
            <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg border">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover border"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Sản phẩm đã mua</p>
              </div>
            </div>

            {/* Rating - Sử dụng component đã tách */}
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              disabled={isView}
            />

            {/* Review Text */}
            <div className="mb-6">
              <label className="text-gray-900 mb-2 font-medium block">
                Nhận xét của bạn
              </label>
              <textarea
                value={reviewText}
                onChange={e => !isView && setReviewText(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                className={`w-full h-28 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${isView ? "bg-gray-50 text-gray-600" : ""}`}
                maxLength={500}
                readOnly={isView}
              />
              <p className="text-xs text-gray-500 mt-1.5 text-right">
                {reviewText.length}/500 ký tự
              </p>
            </div>

            {/* Media Upload */}
            <div className="mb-6">
              <p className="text-gray-900 mb-3 font-medium">
                {mode === "view" ? "Hình ảnh" : "Thêm hình ảnh"}
                <span className="text-gray-500 font-normal text-sm ml-1">
                  (tùy chọn, tối đa 5 ảnh)
                </span>
              </p>

              <div className="grid grid-cols-5 gap-3">
                {oldImages.map((img, index) => (
                  <MediaPreview
                    key={`old-${img.reviewImageId}`}
                    preview={img.imageUrl}
                    file={undefined}
                    index={index}
                    onRemove={i => {
                      if (isView) return;
                      setOldImages(prev => prev.filter((_, idx) => idx !== i));
                    }}
                    mode={mode}
                  />
                ))}

                {/* Media Previews - Sử dụng component đã tách */}
                {mediaPreviews.map((preview, index) => (
                  <MediaPreview
                    key={index}
                    preview={preview}
                    file={mediaFiles[index]}
                    index={index}
                    onRemove={removeMedia}
                    mode={mode}
                  />
                ))}

                {/* Upload Button */}
                {!isView && oldImages.length + mediaPreviews.length < 5 && (
                  <label className="cursor-pointer aspect-square">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                      disabled={mediaPreviews.length >= 5}
                    />
                    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group">
                      <div className="bg-gray-100 rounded-full p-3 group-hover:bg-blue-100 transition-colors">
                        <Camera className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <span className="text-xs text-gray-600 mt-2 font-medium group-hover:text-blue-600 transition-colors">
                        Thêm ảnh
                      </span>
                    </div>
                  </label>
                )}
              </div>

              <div className="mt-3 flex items-start space-x-2 text-xs text-gray-500">
                <Image className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Hình ảnh giúp người mua khác có thêm thông tin về sản phẩm.
                  Dung lượng tối đa 10MB/file, định dạng JPG, PNG.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            {mode !== "view" && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="none"
                        d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
                      />
                    </svg>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  <span>{isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
