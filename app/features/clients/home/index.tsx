import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchHomePageData } from "~/redux/slices/home-page";
import Banner from "./components/banner";
import CategorySection from "./components/category-section";
import FeaturedProducts from "./components/featured-products";
import SpecialDeals from "./components/special-deals";

export default function Home() {
  const dispatch = useAppDispatch();
  const { homeData, isLoading, error } = useAppSelector(
    (state) => state.homePage
  );

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Banner />
      {homeData?.bestSellingCategories &&
        homeData.bestSellingCategories.length > 0 && <CategorySection />}
      {homeData?.bestSellingProducts &&
        homeData.bestSellingProducts.length > 0 && (
          <FeaturedProducts products={homeData.bestSellingProducts} />
        )}
      {homeData?.onSaleProducts && homeData.onSaleProducts.length > 0 && (
        <SpecialDeals products={homeData.onSaleProducts} />
      )}
    </main>
  );
}
