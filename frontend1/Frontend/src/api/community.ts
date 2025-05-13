// fetch community data by ID
// fetch communityPosts by communityId 

import axios from "axios";

import { Community, Post , Rules, Tag, Moderator } from '@/types/index';

const API_BASE_URL = 'http://localhost:3000/api';




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

// Community API Service

 export const  fetchCommunityDetailsById = async (communityId: string): Promise<Community> => {
  
    try {
      const response = await api.get(`/community/${communityId}`);
      return response.data;

      } catch (error) {
      return handleApiError(error, 'Community not found');
    }
  }


  
 


  export const joinCommunity = async (communityId: string): Promise<any> => {
    try {
      const response = await api.post(`/community/${communityId}/join`);
      return {
        success: true,
        user: response.data.user // Ensure your backend returns updated user
      };
    } catch (error) {
      return handleApiError(error, 'Failed to join community');
    }
  }


  export const leaveCommunity = async (communityId: string): Promise<any> => {
    try {
      const response = await api.post(`/community/${communityId}/leave`);
      return {
        succes : true,
        user : response.data.user
      }
    } catch (error) {
      return handleApiError(error, 'Failed to leave community');
    }
  }

  export const createCommunityTag = async(communityId : string,  tagData: {
    name: string;
    description: string;
    isPublic: boolean;
    accessCode?: string;
  }) : Promise<Tag> => {
      try{
        const response = await api.post<{tag: Tag}> (`/community/${communityId}/addTag`, {
            name: tagData.name.trim().toUpperCase(), // Ensure consistent formatting
        description: tagData.description.trim(),
        isPublic: tagData.isPublic,
        ...(tagData.isPublic ? {} : { accessCode: tagData.accessCode?.trim() }),
            
        }
       )
       if (!response.data?.tag) {
        throw new Error('Invalid response format from server');
      }
       return response.data.tag;
      } catch(error) {
        return handleApiError(error, 'Failed to create tag');
      }     
  }
