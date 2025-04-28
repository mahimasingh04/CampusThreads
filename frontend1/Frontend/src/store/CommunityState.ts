import { atom, selector } from 'recoil';
import { Community, Post, Tag,  User, SortOption, Rules } from '@/types';
import {
    fetchCommunityById,
    fetchCommunityPosts,
    fetchCommunityMembers,
    fetchCommunityRules,
    fetchCommunityTags,
     fetchCommunityModerators,
     createCommunityTag
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


export const communityDetailsState = selector<Community | null >({
  key: 'communityDetailsState',
  get: async ({ get }) => {
    const communityId = get(communityIdState);
    if (!communityId) return null;

    try {
      const community = await fetchCommunityById(communityId);
      return community;
    } catch (error) {
      console.error('Error fetching community:', error);
      return null;
    }
  },
});

export const communityRulesState = selector<Rules[]> ({
  key:'communityRulesState',
  get: async({get}) => {
     const communityId = get(communityIdState);
     if(!communityId) return[];
     try{
         const rules = await fetchCommunityRules(communityId);
         return rules;
     }catch(error) {
      console.error('error fetching rules:', error);
      return [];
     }
  }
})


export const communityMemberCountState = selector<number>({
    key:'communityMemberCountState',
    get: async({get}) => {
        const communityId = get(communityIdState)
        if(!communityId) {
            return 0
        }
        try {
            const count = await fetchCommunityMembers(communityId)
            return count
        }catch(error) {
            console.error('error fetching community members: ', error)
            return 0;
        }
           
    }
})
  
export const communityTagState = atom<Tag[]> ({
    key: 'communityTagState',
    default: []
})

export const communityModeratorsState = selector<string[]>({
  key: 'communityModeratorsState',
  get: async ({get}) => {
    const communityId = get(communityIdState);
    if (!communityId) return [];
    
    try {
      const mods = await fetchCommunityModerators(communityId);
      return mods;
    } catch (error) {
      console.error('Error fetching community moderators:', error);
      return [];
    }
  }
});