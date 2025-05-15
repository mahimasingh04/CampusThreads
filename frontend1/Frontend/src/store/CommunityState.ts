import { atom, selector } from 'recoil';
import {   Community, Tag,  SortOption ,CommunityHeaderProps} from '@/types';
import {
   fetchCommunityDetailsById
  } from '@/api/Community';




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
    
    };
  }
});

export const communityDataState = selector({
  key: 'communityDataState',
  get: ({ get }) => {
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
      tags: response.tags || [],
      rules: response.rules || [],
      moderators: response.moderators || [],
    };
  }
});




export const communityTagState = atom<Tag[]> ({
    key: 'communityTagState',
    default: []
})

