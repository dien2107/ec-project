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
          min="0"
          step="1000"
          {...register("basePrice", {
            required: "Vui lòng nhập giá cơ bản",
            min: {
              value: 0,
              message: "Giá cơ bản không hợp lệ",
            },
            valueAsNumber: true,
          })}
        />
        {errors.basePrice && (
          <p className="text-sm text-red-500">{errors.basePrice.message}</p>
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
          min="0"
          max="100"
          step="1"
          {...register("discountPercentage", {
            required: "Giảm giá không được để trống",
            min: { value: 0, message: "Giảm giá phải ≥ 0" },
            max: { value: 100, message: "Giảm giá phải ≤ 100" },
            valueAsNumber: true,
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
