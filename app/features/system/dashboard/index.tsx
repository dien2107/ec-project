import StatisticCards from "./components/statistic-cards";
import RevenueChart from "./components/revenue-chart";
import CategoryChart from "./components/category-chart";
import WeeklyRevenueChart from "./components/weekly-revenue-chart";
import TopSellingProductsChart from "./components/top-selling-products";
import RecentOrders from "./components/recent-orders";

export default function Dashboard() {
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Tổng quan</h3>
      </div>

      <div className="flex flex-col gap-4">
        <StatisticCards />
        <div className="grid grid-cols-3 gap-4">
          <RevenueChart />
          <CategoryChart />
          <WeeklyRevenueChart />
          <TopSellingProductsChart />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
