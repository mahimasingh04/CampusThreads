// fetch community data by ID
// fetch communityPosts by communityId 

import axios from "axios";

import { Community, Post , Rules, Tag } from '@/types/index';

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

 export const  fetchCommunityById = async (communityId: string): Promise<Community> => {
    try {
      const response = await api.get(`/community/${communityId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Community not found');
    }
  }


   export const  fetchCommunityPosts = async (communityId: string, tag?: string): Promise<Post[]> => {
    try {
      const url = tag 
        ? `/community/${communityId}/posts?tag=${tag}`
        : `/community/${communityId}/posts`;
      const response = await api.get(url);
      return response.data.posts || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch posts');
    }
  }

 export const  fetchCommunityMembers=  async (communityId: string): Promise<number> => {
    try {
      const response = await api.get(`/community/${communityId}/members`);
      return response.data.count || 0;
    } catch (error) {
      return handleApiError(error, 'Failed to fetch member count');
    }
  }

  export const fetchCommunityRules =  async (communityId: string): Promise<Rules[]> => {
    try {
      const response = await api.get(`/community/${communityId}/rules`);
      return response.data.rules || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch rules');
    }
  }

 export const  fetchCommunityTags =  async (communityId: string): Promise<Tag[]> => {
    try {
      const response = await api.get<{ tags: Tag[] }>(`/community/${communityId}/tags`);
      return response.data.tags || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch tags');
    }
  }

  export const fetchCommunityModerators = async (communityId: string): Promise<string[]> => {
    try {
      const response = await api.get(`/community/${communityId}/moderators`);
      return response.data.moderators || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch moderators');
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
