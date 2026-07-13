import axios from 'axios';

/**
 * Base URL for the FastAPI backend. Per the backend's own CORS config
 * (main.py allows http://localhost:5173) this targets the local dev server
 * by default. Override with VITE_API_BASE_URL if needed at build time.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * All routes in interview_routes.py raise HTTPException(500, detail=str(e))
 * on failure, so error.response.data.detail is the reliable place to find a
 * human-readable message. Normalizing it here means every service function
 * and every component gets a consistent shape to display, instead of each
 * call site re-deriving it from the raw Axios error.
 */
export function extractErrorMessage(error) {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
