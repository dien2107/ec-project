import { useParams } from "react-router";
import ProductImageGallery from "./components/product-image-gallery";
import ProductDetail from "./components/product-detail";
import TabsInfo from "./components/tabs-info";
import ProductRelated from "./components/product-related";
import { fakeImagesOfProduct } from "./data/images";

export default function Product() {
  const { id } = useParams();

  return (
    <div className="main-container">
      <div className="grid grid-cols-12 gap-8 py-8">
        <div className="col-span-6">
          <ProductImageGallery images={fakeImagesOfProduct} />
        </div>
        <div className="col-span-6">
          <ProductDetail />
        </div>
      </div>
      <TabsInfo />
      <ProductRelated />
    </div>
  );
}
