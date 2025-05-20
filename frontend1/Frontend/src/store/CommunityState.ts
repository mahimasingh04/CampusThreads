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



const fetchCommunities = async (): Promise<Community[]> => {
  try {
    const response = await fetch('/api/communities');
    if (!response.ok) throw new Error('Failed to fetch communities');
    return await response.json();
  } catch (error) {
    console.error('Error fetching communities:', error);
    return []; // Return empty array as fallback
  }
};

export const communitiesState = atom<Community[]>({
  key: "communitiesState",
  default: fetchCommunities(), // This will automatically fetch when first used
});

export const communityRulesState = atom<Record<string, Rule[]>>({
  key: "communityRulesState",
  default: {},
});

export const communityTagsState = atom<Record<string, Tag[]>>({
  key: "communityTagsState",
  default: {},
});

export const selectedCommunityIdState = atom<string | null>({
  key: "selectedCommunityIdState",
  default: null,
});


export const selectedCommunityState = selector<Community | null>({
  key: "selectedCommunityState",
  get: ({ get }) => {
    const communities = get(communitiesState);
    const selectedId = get(selectedCommunityIdState);
    if (!selectedId) return null;
    
    const community = communities.find(c => c.id === selectedId);
    if (!community) {
      console.warn(`Community with ID ${selectedId} not found`);
      return null;
    }
    return community;
  },
});