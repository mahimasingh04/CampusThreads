

import { User , Community, Tag, Post, Rule } from '@/types';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/api';

interface CommunityDetailsResponse {
  community: Community;
  posts: Post[];
  tags: Tag[];
  rules: Rule[];
  moderators: User[];
}

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

export const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await api.get('/api/auth/me');
  return response.data;
    }catch(error) {
       return handleApiError(error, 'Failed to get current user');
    
    }
  
};

