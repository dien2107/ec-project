import { memo } from "react";
import { X, Video } from "lucide-react";

const MediaPreview = memo(
  ({
    preview,
    file,
    index,
    onRemove,
    mode,
  }: {
    preview: string;
    file?: File;
    index: number;
    onRemove: (index: number) => void;
    mode: string;
  }) => {
    const isVideo = file?.type?.startsWith("video") ?? false;

    return (
      <div className="relative aspect-square group">
        {isVideo ? (
          <video
            src={preview}
            className="w-full h-full object-cover rounded-lg border border-gray-200"
            controls={false}
          />
        ) : (
          <img
            src={preview}
            alt={`Preview ${index}`}
            className="w-full h-full object-cover rounded-lg border border-gray-200"
          />
        )}

        {mode !== "view" && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button
              onClick={() => onRemove(index)}
              className="bg-white text-red-600 rounded-full p-2 hover:bg-red-50 shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
              type="button"
              aria-label="Remove media"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {isVideo && (
          <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Video className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    );
  }
);

export default MediaPreview;
