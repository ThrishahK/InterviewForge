import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
});

export function extractErrorMessage(error) {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}