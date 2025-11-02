import { X, Star, Camera, Video, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export default function ReviewForm({
  productName,
  productImage,
  onClose,
  onSubmit,
}: {
  productName: string;
  productImage: string;
  onClose: () => void;
  onSubmit: (review: any) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mediaFiles.length > 5) {
      alert("Tối đa 5 ảnh/video");
      return;
    }

    setMediaFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao");
      return;
    }

    onSubmit({
      rating,
      text: reviewText,
      media: mediaFiles,
      productName,
      productImage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative p-6 border-b bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <Button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-full text-white"
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold">Đánh giá sản phẩm</h2>
            <p className="text-pink-100 text-sm mt-1">
              Chia sẻ trải nghiệm của bạn
            </p>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Product Info */}
            <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <img
                src={productImage}
                alt={productName}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{productName}</h3>
                <p className="text-sm text-gray-500">Sản phẩm đã mua</p>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6 text-center">
              <p className="text-gray-700 mb-3 font-medium">
                Bạn cảm thấy sản phẩm thế nào?
              </p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {rating === 1 && "Rất không hài lòng"}
                  {rating === 2 && "Không hài lòng"}
                  {rating === 3 && "Bình thường"}
                  {rating === 4 && "Hài lòng"}
                  {rating === 5 && "Rất hài lòng"}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này... (tùy chọn)"
                className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {reviewText.length}/500
              </p>
            </div>

            {/* Media Upload */}
            <div className="mb-6">
              <p className="text-gray-700 mb-3 font-medium">
                Thêm ảnh/video (tùy chọn)
              </p>

              {/* Media Previews */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      {mediaFiles[index]?.type.startsWith("video") ? (
                        <video
                          src={preview}
                          className="w-full h-full object-cover rounded-lg"
                          controls={false}
                        />
                      ) : (
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {mediaFiles[index]?.type.startsWith("video") && (
                        <Video className="absolute bottom-1 right-1 h-4 w-4 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Buttons */}
              <div className="flex space-x-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 cursor-pointer transition-colors">
                    <Camera className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Ảnh</span>
                  </div>
                </label>

                <label className="flex-1">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 cursor-pointer transition-colors">
                    <Video className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Video</span>
                  </div>
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Tối đa 5 ảnh/video • Dung lượng tối đa 10MB/file
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              <span>Gửi đánh giá</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
