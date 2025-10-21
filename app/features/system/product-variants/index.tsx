import { Loader2, Package, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  clearProductVariants,
  fetchProductVariants,
} from "~/redux/slices/product-variants";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { ProductVariant as ProductVariantType } from "~/types/product/product-variant";
import EditProductVariantDialog from "./components/edit-product-variant-dialog";
import ProductVariant from "./components/product-variant";
import AddProductVariantDialog from "./components/add-product-variant-dialog";
import DeleteProductVariantDialog from "./components/delete-product-variant-dialog";

const ProductVariantRow = ({ productId }: { productId: number }) => {
  const dispatch = useAppDispatch();
  const variants = useAppSelector(
    (state) => state.productVariantList.variantsByProductId[productId]
  );
  const isLoading = useAppSelector(
    (state) => state.productVariantList.isLoadingByProductId[productId]
  );

  const [editOpen, setEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantType | null>(null);

  useEffect(() => {
    if (!variants) dispatch(fetchProductVariants(productId));
    return () => {
      dispatch(clearProductVariants(productId));
    };
  }, [dispatch, productId]);

  const handleEdit = (variant: ProductVariantType) => {
    setSelectedVariant(variant);
    setEditOpen(true);
  };

  const handleDelete = (variant: ProductVariantType) => {
    setSelectedVariant(variant);
    setIsDeleteOpen(true);
  };

  const handleReloadProductVariantList = useCallback(() => {
    dispatch(fetchProductVariants(productId));
  }, [dispatch, productId]);

  return (
    <div className="flex flex-col p-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium flex items-center gap-2">
          <Package />
          Biến thể sản phẩm ({variants ? variants.length : 0})
        </h4>
        <Button
          className="bg-[#3770EC] text-white"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus />
          Thêm biến thể
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin w-5 h-5" />
            Đang tải...
          </div>
        ) : (
          variants?.map((variant) => (
            <div key={variant.productVariantId} className="relative">
              <ProductVariant
                variant={variant}
                onEdit={() => handleEdit(variant)}
                onDelete={() => handleDelete(variant)}
              />
            </div>
          ))
        )}
      </div>

      {selectedVariant && (
        <EditProductVariantDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          variant={selectedVariant}
          variants={variants ?? []}
          onUpdated={handleReloadProductVariantList}
        />
      )}

      {selectedVariant && (
        <DeleteProductVariantDialog
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          productId={productId}
          variant={selectedVariant}
          onDeleted={handleReloadProductVariantList}
        />
      )}

      <AddProductVariantDialog
        open={isAddOpen}
        productId={productId}
        onClose={() => setIsAddOpen(false)}
        onAdded={handleReloadProductVariantList}
        variants={variants ?? []}
      />
    </div>
  );
};

export default ProductVariantRow;
