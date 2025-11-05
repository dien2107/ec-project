import instance from "./customize-axios";

export const getDashboardOverview = async () => {
  try {
    const response = await instance.get("/dashboard/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    throw error;
  }
};

export const getMonthlyRevenue = async () => {
  try {
    const response = await instance.get("/dashboard/monthly-revenue");
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    throw error;
  }
};

export const getCategorySalesPercentage = async (params?: {
  startDate?: string;
  endDate?: string;
  preset?: string;
}) => {
  try {
    const response = await instance.get(
      "/dashboard/category-sales-percentage",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category sales percentage:", error);
    throw error;
  }
};

export const getMonthlyRevenueStats = async (params?: { year?: number }) => {
  try {
    const response = await instance.get("/dashboard/monthly-revenue-stats", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly revenue stats:", error);
    throw error;
  }
};

export const getTopSellingProducts = async (params?: {
  top?: number;
  year?: number;
}) => {
  try {
    const response = await instance.get("/dashboard/top-selling-products", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    throw error;
  }
};

export const getWeeklySales = async () => {
  try {
    const response = await instance.get("/dashboard/weekly-sales");
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    throw error;
  }
};

export const getMonthlyProfit = async (params?: { year?: number }) => {
  try {
    const response = await instance.get("/dashboard/monthly-profit", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly profit:", error);
    throw error;
  }
};
