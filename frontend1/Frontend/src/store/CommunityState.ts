import { atom, selector } from 'recoil';
import {   Tag,  SortOption } from '@/types';
import {
   fetchCommunityDetailsById
  } from '@/api/Community';



export const communityIdState = atom<string | undefined>({
  key: 'communityIdState',
  default: undefined,
});

export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: true,
});

export const sortOptionState = atom<SortOption>({
  key: 'sortOptionState',
  default: 'hottest',
});



export const communityState = selector<any>({
  key: 'communityState',
  get: async ({ get }) => {
    const communityId = get(communityIdState);
    if(!communityId) return null;
    try{
      const response = await fetchCommunityDetailsById(communityId);
       return {
        
        name : response.name,
        description : response.description,
        membersCount : response.membersCount,
        createdAt  : response.createdAt
      


       }
    }catch(error) {
      console.error('Error fetching community data:', error);
      return null;
    }
  },
  set: ({set}, newValue) => {
    set(communityState, newValue);

  },
});



export const communityDataState = selector<any>({
  key: 'communityDataState',
  get: async ({ get }) => {
    const communityId = get(communityIdState);
    const sortOption = get(sortOptionState)
    if (!communityId) return null;

    try {
      const response = await fetchCommunityDetailsById(communityId);

        const sortedPosts = response.posts.sort((a,b) => {
           if(sortOption === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
           }else if (sortOption === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          } else { // hottest
            return b.upvoteCount - a.upvoteCount;
          }
        })

      return {
        
        posts : sortedPosts,
        tags : response.tags,
        rules : response.rules,
        moderators : response.moderators,
        
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
      return null;
    }
  },
  set: ({ set }, newValue) => {
    // This allows you to set the community data directly if needed
    set(communityDataState, newValue);
  },
});


  
export const communityTagState = atom<Tag[]> ({
    key: 'communityTagState',
    default: []
})

