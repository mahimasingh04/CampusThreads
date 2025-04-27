import { atom, selector } from 'recoil';
import { Community, Post, Tag, Rule, User, SortOption } from '@/types';
import {
    fetchCommunityById,
    fetchCommunityPosts,
    fetchCommunityMembers,
    fetchCommunityRules,
    fetchCommunityTags,
     fetchCommunityModerators,
     createCommunityTag
  } from '@/api/community';



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

export const communityState = selector<Community | null>({
  key: 'communityState',
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

export const communityDataState = selector({
  key: 'communityDataState',
  get: async ({ get }) => {
    const communityId = get(communityIdState);
    if (!communityId) {
      return {
        posts: [],
        tags: [],
        rules: [],
        moderators: [],
      };
    }

    try {
      const [posts, tags, rules, moderators] = await Promise.all([
        fetchCommunityPosts(communityId),
        fetchCommunityTags(communityId),
        fetchCommunityRules(communityId),
        fetchCommunityModerators(communityId),
      ]);

      const sortOption = get(sortOptionState);
      const sortedPosts = [...posts].sort((a, b) => {
        if (sortOption === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else { // hottest
          return b.upvoteCount - a.upvoteCount;
        }
      });

      return {
        posts: sortedPosts,
        tags,
        rules,
        moderators,
      };
    } catch (error) {
      console.error('Error fetching community data:', error);
      return {
        posts: [],
        tags: [],
        rules: [],
        moderators: [],
      };
    }
  },
});

export const communityMmeberCountState = selector<number>({
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
  
export const communityTagState = selector<Tag[]> ({
    key: 'communityTagState',
    get: async({get}) => {
        const communityId = get(communityIdState)
        if(!communityId) {
            return []
        }
        try {
          const tags = await fetchCommunityTags(communityId)
            return tags;
        }catch(error) {
            console.error('error fetching community tags: ', error)
            return []
        }
    }
})
