import axios from "axios";

const API_BASE_URL = 'http://localhost:3000/api/tags'
// Create configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
 
  withCredentials : true, // This handles cookies automatically
  headers: {
    'Content-Type': 'application/json',
  }
});

// Generic error handler
const handleApiError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || error.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};


// api/tagApi.ts
export const verifyTagAccessCode = async (
  tagId: string,
  accessCode: string
): Promise<{ isValid: boolean }> => {
   try {
   const response = await api.post('/private-tag/isValid')
   
   }catch(error) {

   }
};