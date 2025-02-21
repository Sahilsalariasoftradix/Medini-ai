import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_MEDINI_API_URL, // Use .env for API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
