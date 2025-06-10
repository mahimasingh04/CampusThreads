// fetch community data by ID
// fetch communityPosts by communityId 

import axios from "axios";

import { Community, Tag, CommunitySummary, TagDetail, CommunityRule } from '@/types/index';

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

 export const  fetchCommunityDetailsById = async (identifier: string): Promise<Community> => {
  
    try {

      const response = await api.get(`/community/getComm/${encodeURIComponent(identifier)}`);
      if(!response.data) {
        throw new Error('Invalid response format from server');
      }
      return response.data.data;


      } catch (error) {
      return handleApiError(error, 'Community not found');
    }
  }


  
 


  export const joinCommunity = async (): Promise<any> => {
    try {
      const response = await api.post(`/community/join`);
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

export const fetchCommunities = async (): Promise<CommunitySummary[]> => {
  try {
    const response = await api.get<{ success: boolean; data: CommunitySummary[] }>(
      '/community/getCommunities'
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch communities');
    }

    return response.data.data.map(community => ({
      ...community,
      createdAt: new Date(community.createdAt) // Convert string to Date object
    }));
  } catch (error) {
    return handleApiError(error, 'Failed to fetch communities');
  }
};

export const fetchCommunityTags = async(communityId: string) : Promise<TagDetail[]> => {
    try{
       const response = await api.get<{success:boolean; data: TagDetail[]}> (
        `/community/${communityId}/tags`
       
       )

       console.log('fetched Tags : ', response.data.data)
       if(!response.data.success) {
        throw new Error('Failed to fetch tags');
       }

       return response.data.data
       

    }catch(error) {
         return handleApiError(error, 'Failed to fetch tags')
    }
}

export const fetchCommunityRules =  async(communityId: string): Promise<CommunityRule[]> => {

   try {
    const response = await api.get(`/community/${communityId}/rules`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch rules');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching community rules:', error);
    throw error;
  }
}

