import { atom, DefaultValue, selector } from 'recoil';
import {  Post, Community, Tag,  SortOption, Moderator, Rule } from '@/types';
import {
   fetchCommunityDetailsById
  } from '@/api/Community';


// fetch community data by ID
// fetch communityPosts by communityId 

interface CommunityData {
  posts: Post[]; // Replace 'any' with your Post type
  rules: {
    id: string;
    order: number;
    title: string;
    description: string;
  }[];
  tags: Tag[] | undefined;
  moderators: Moderator[]; // Replace 'any' with your Moderator type
}

export const communityIdentifierState = atom<string | null>({
  key: 'communityIdentifierState',
  default: null,
});


export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: true,
});

export const sortOptionState = atom<SortOption>({
  key: 'sortOptionState',
  default: 'hottest',
});

export const rawCommunityResponseState = selector({
  key: 'rawCommunityResponseState',
  get: async ({ get }) => {
    const identifier = get(communityIdentifierState);
     console.log("Fetching data for:", identifier);
    
    if (!identifier) throw new Error('No identifier');
    
    try {
      const response = await fetchCommunityDetailsById(identifier);
      console.log("API Response:", response);
       if (!response) throw new Error('Community not found');
      return response;
    } catch (error) {
      console.error('Error fetching community data:', error);
      return null;
    }
  }
});


export const communityState = selector<any>({
  key: 'communityState',
  get: ({ get }) => {
    const response = get(rawCommunityResponseState);
    if (!response) return null;
    
    return {
      id: response.id,
      name: response.name,
      description  : response.description
    
    };
  }
});

export const communityDataState = selector<CommunityData | null>({
  key: 'communityDataState',
  get: async ({ get }): Promise<CommunityData | null> => {
    const response = get(rawCommunityResponseState);
    const sortOption = get(sortOptionState);
    if (!response) return null;
   
    const sortedPosts = response.posts?.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else { // hottest
        return (b.upvoteCount || 0) - (a.upvoteCount || 0);
      }
    }) || [];

    return {
      posts: sortedPosts,
      rules: response.rules?.map(rule => ({
        id: rule.id || crypto.randomUUID(),
        order: rule.order || 0,
        title: rule.title || 'Untitled rule',
        description: rule.description || ''
      })) || [],
     tags : response.tags,
      moderators: response.moderators || [],
    };
  }
});






