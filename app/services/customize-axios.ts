import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Trả về toàn bộ response object để có thể access status, headers, etc.
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", error.response.data);

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - maybe redirect to login
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error("Unexpected error");
      }
    } else if (error.request) {
      // Network error
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default instance;
