
import { atom , selector} from 'recoil';

import { Community, CustomFeed, Post, User , Rule, CommnityIconProps } from '@/types';


import {getCurrentUser} from '@/api/User'

export const currentUserState = atom<User | null>({
  key: 'currentUserState',
  default: null,
});



export const currentUserQuery = selector({
  key: 'currentUserQuery',
  get: async () => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  set: ({set}, newValue) => {
    set(currentUserState, newValue);
  },
});
// User's joined communities
export const joinedCommunitiesState = atom<Community[]>({
  key: 'joinedCommunitiesState',
  default: [],
});

// Recently visited communities
export const recentCommunitiesState = atom<Community[]>({
  key: 'recentCommunitiesState',
  default: [],
});

export const customFeedsState = atom<CustomFeed[]>({
  key: 'customFeedsState',
  default: [],
});

// Feed posts
export const feedPostsState = atom<Post[]>({
  key: 'feedPostsState',
  default: [],
});

// Loading state for feed
export const feedLoadingState = atom<boolean>({
  key: 'feedLoadingState',
  default: false,
});

// Feed page number for infinite scrolling
export const feedPageState = atom<number>({
  key: 'feedPageState',
  default: 1,
});

// Sidebar collapsed state
export const sidebarCollapsedState = atom<boolean>({
  key: 'sidebarCollapsedState',
  default: false,
});

// Mock data for development
export const mockDataLoadedState = atom<boolean>({
  key: 'mockDataLoadedState',
  default: false,
});

export const communityRulesState = atom<Record<string, Rule[]>>({
  key: 'communityRulesState',
  default: {},
});