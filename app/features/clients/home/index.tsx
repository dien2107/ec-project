import Banner from "./components/banner";
import CategoryList from "./components/category-list";
import FeaturedProducts from "./components/featured-products";

export default function Home() {
  return (
    <main className="bg-white">
      <Banner />
      <CategoryList />
      <FeaturedProducts />
    </main>
  );
}
