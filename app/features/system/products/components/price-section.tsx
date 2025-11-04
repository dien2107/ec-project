import { Input } from "~/components/ui/input";
import { useMemo, memo } from "react";
import { useWatch } from "react-hook-form";
import { formatVND } from "~/libs";

const PriceSection = memo(({ control, register, errors, isLoading }: any) => {
  const basePrice = useWatch({ control, name: "basePrice", defaultValue: 0 });
  const discount = useWatch({
    control,
    name: "discountPercentage",
    defaultValue: 0,
  });

  const sellingPrice = useMemo(() => {
    const base = Number(basePrice) || 0;
    const disc = Number(discount) || 0;
    return base > 0 ? Math.round(base * (1 - disc / 100)) : 0;
  }, [basePrice, discount]);

  return (
    <div className="flex items-center gap-4 col-span-2">
      {/* Giá cơ bản */}
      <div className="flex-1">
        <label htmlFor="basePrice" className="text-sm font-medium">
          Giá cơ bản
        </label>
        <Input
          type="number"
          id="basePrice"
          disabled={isLoading}
          className="mt-1"
          placeholder="Nhập giá cơ bản"
          onKeyDown={(e) => {
            if (
              !/^\d$/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Delete" &&
              e.key !== "Tab"
            ) {
              e.preventDefault();
            }
          }}
          {...register("basePrice", {
            required: "Vui lòng nhập giá cơ bản",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Giá cơ bản phải lớn hơn hoặc bằng 0",
            },
          })}
        />
        {errors.basePrice && (
          <p className="text-xs text-red-500">{errors.basePrice.message}</p>
        )}
      </div>

      {/* Giảm giá (%) */}
      <div className="flex-1">
        <label htmlFor="discountPercentage" className="text-sm font-medium">
          Giảm giá (%)
        </label>
        <Input
          type="number"
          id="discountPercentage"
          disabled={isLoading}
          className="mt-1"
          placeholder="Nhập giảm giá"
          {...register("discountPercentage", {
            required: "Giảm giá không được để trống",
            valueAsNumber: true,
            validate: (value: number) => {
              if (isNaN(value)) return "Giảm giá không hợp lệ";
              if (value < 0) return "Giảm giá phải lớn hơn hoặc bằng 0";
              if (value > 100) return "Giảm giá phải nhỏ hơn hoặc bằng 100";
              return true;
            },
          })}
        />
        {errors.discountPercentage && (
          <span className="text-red-500 text-xs">
            {errors.discountPercentage.message}
          </span>
        )}
      </div>

      {/* Giá bán */}
      <div className="flex-1">
        <label htmlFor="sellingPrice" className="text-sm font-medium">
          Giá bán
        </label>
        <Input
          type="text"
          id="sellingPrice"
          value={formatVND(sellingPrice)}
          disabled
          className="mt-1 bg-gray-100"
        />
      </div>
    </div>
  );
});

export default PriceSection;
