import customAxios from "~/services/customize-axios";

// Helper function để demo việc access status và response properties
export const testApiStatus = async () => {
  try {
    // Test GET request
    const response = await customAxios.get(
      "https://jsonplaceholder.typicode.com/users/1"
    );

    console.log("=== API Response Details ===");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Headers:", response.headers);
    console.log("Data:", response.data);
    console.log("Config:", response.config);

    return {
      success: true,
      status: response.status,
      data: response.data,
      message: `Request successful with status ${response.status}`,
    };
  } catch (error: any) {
    console.error("=== API Error Details ===");

    if (error.response) {
      // Server responded with error status
      console.error("Error Status:", error.response.status);
      console.error("Error Status Text:", error.response.statusText);
      console.error("Error Headers:", error.response.headers);
      console.error("Error Data:", error.response.data);

      return {
        success: false,
        status: error.response.status,
        data: error.response.data,
        message: `Server error: ${error.response.status} - ${error.response.statusText}`,
      };
    } else if (error.request) {
      // Network error
      console.error("Network Error:", error.request);
      return {
        success: false,
        status: null,
        data: null,
        message: "Network error - no response received",
      };
    } else {
      // Something else happened
      console.error("Unknown Error:", error.message);
      return {
        success: false,
        status: null,
        data: null,
        message: `Unknown error: ${error.message}`,
      };
    }
  }
};

// Test different HTTP methods and status codes
export const testDifferentStatusCodes = async () => {
  const tests = [
    {
      name: "Successful GET",
      request: () =>
        customAxios.get("https://jsonplaceholder.typicode.com/users/1"),
    },
    {
      name: "Not Found (404)",
      request: () =>
        customAxios.get("https://jsonplaceholder.typicode.com/users/999999"),
    },
    {
      name: "Successful POST",
      request: () =>
        customAxios.post("https://jsonplaceholder.typicode.com/posts", {
          title: "Test Post",
          body: "Test Body",
          userId: 1,
        }),
    },
  ];

  const results = [];

  for (const test of tests) {
    console.log(`\n🧪 Testing: ${test.name}`);
    try {
      const response = await test.request();
      console.log(`✅ Status: ${response.status} - ${response.statusText}`);
      results.push({
        test: test.name,
        success: true,
        status: response.status,
        statusText: response.statusText,
      });
    } catch (error: any) {
      console.log(
        `❌ Error: ${error.response?.status || "Network"} - ${error.message}`
      );
      results.push({
        test: test.name,
        success: false,
        status: error.response?.status || null,
        statusText: error.response?.statusText || "Network Error",
      });
    }
  }

  return results;
};
