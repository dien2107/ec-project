import StatisticCards from "./components/statistic-cards";
import RevenueChart from "./components/revenue-chart";
import CategoryChart from "./components/category-chart";
import WeeklyRevenueChart from "./components/weekly-revenue-chart";
import TopSellingProductsChart from "./components/top-selling-products";

export default function Dashboard() {
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Tổng quan</h3>
      </div>

      <div className="flex flex-col gap-4">
        <StatisticCards />
        <div className="grid grid-cols-3 gap-4 auto-rows-fr">
          <div className="h-full col-span-2">
            <RevenueChart />
          </div>
          <div className="h-full col-span-1">
            <CategoryChart />
          </div>

          <div className="h-full col-span-1">
            <WeeklyRevenueChart />
          </div>
          <div className="h-full col-span-2">
            <TopSellingProductsChart />
          </div>
        </div>
      </div>
    </div>
  );
}
