import { Community , CommunityRule, CommunitySummary, Rule,Tag, TagDetail} from '@/types';
import { atom, selector, selectorFamily } from 'recoil';
import { fetchCommunities, fetchCommunityRules, fetchCommunityTags } from '@/api/Community';




export const selectedCommunityIdState = atom<string | null>({
  key: 'selectedCommunityIdState',
  default: null,
});

export const communitiesState = selector<CommunitySummary[]>({
     key: 'communitiesState',
  get: async () => {
    try {
      const response = await fetchCommunities();     //fetch all the communities 
      return response
    } catch (error) {
      console.error('Failed to fetch communities:', error);
      return [];
    }
  },
})

export const communityRulesState = selector<CommunityRule[]>({
  key: 'communityRulesState',
  get: async ({ get }) => {
    const communityId = get(selectedCommunityIdState);
    if (!communityId) return [];
    
    try {
      const response = await fetchCommunityRules(communityId);
      return response;
    } catch (error) {
      console.error('Failed to fetch community rules:', error);
      return [];
    }
  },
});

export const communityTagsState = selector<TagDetail[]>({
  key: 'communityTagsState',
  get: async ({ get }) => {
    const communityId = get(selectedCommunityIdState);
    if (!communityId) return [];
    
    try {
      const response = await fetchCommunityTags(communityId);
      return response;
    } catch (error) {
      console.error('Failed to fetch community tags:', error);
      return [];
    }
  },
});

export const selectedTagsState = atom<Tag[]>({
  key: 'selectedTagsState',
  default: [],
});

export const selectedCommunityState = selector<CommunitySummary | null>({
  key: 'selectedCommunityState',
  get: ({ get }) => {
    const communityId = get(selectedCommunityIdState);
    const communities = get(communitiesState);
    return communities.find(c => c.id === communityId) || null;
  },
});

