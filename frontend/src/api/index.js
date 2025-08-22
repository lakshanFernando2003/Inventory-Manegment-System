import { axiosIntance, authAxiosInstance } from '../components/utils/axios';

// Export renamed instances for clarity
export const api = axiosIntance;
export const authApi = authAxiosInstance;

// Helper function for error handling
export const handleApiError = (error) => {
  return error.response?.data?.message ||
         error.message ||
         'An unknown error occurred';
};
