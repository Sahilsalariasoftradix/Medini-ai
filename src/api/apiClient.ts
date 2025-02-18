import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://dev-api.medini.ca', // Use .env for API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
